import requests
from json import dump
from datetime import datetime, timedelta
from typing import TypedDict, Optional
from ..conventions import crush


class HelloAssoMemberEntry(TypedDict):
    """
    JSON payload for a Membership entry returned by the HelloAsso API
    """
    order: dict
    payer: dict
    name: str
    user: dict
    priceCategory: str
    qrCode: str
    membershipCardUrl: str
    tierDescription: str
    tierId: int
    id: int
    amount: int
    type: str
    initialAmount: int
    state: str


class HelloAssoMembersAPI:
    def __init__(self, client_id: str, client_secret: str, membership_duration: int,  max_pages: int, max_sync: timedelta):
        self.token = None
        self.max_pages = max_pages
        self.max_sync = max_sync
        self.client_id = client_id
        self.client_secret = client_secret
        self.grant_type = "client_credentials" # This type gives access only a HelloAsso client to his own organization data
        self.membership_duration = membership_duration

    def connect_oauth(self):
        """
        Requests a 30-min authentication token, that should be sufficient to use here without refreshing the token
        """
        url = "https://api.helloasso.com/oauth2/token"
        body = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": self.grant_type
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = requests.post(url, data=body, headers=headers)
        response_data = response.json()
        if "access_token" in response_data:
            self.token = response_data["access_token"]
        else:
            raise IOError("HelloAsso auth failed: are the network config, client_id and client_secret correct?")

    def get_helloasso_members(self, organization_slug: str, form_slug: str) -> list:
        url = f"https://api.helloasso.com/v5/organizations/{organization_slug}/forms/Membership/{form_slug}/items"
        headers = {"Authorization": f"Bearer {self.token}"}
        params = {
            "pageSize": 100,
            "pageIndex": 1,
            "withDetails": True
        }
        raw_response = requests.get(url, headers=headers, params=params)  # retrieve page 1
        if raw_response.ok:
            response = raw_response.json()
            first_page = int(response["pagination"]["pageIndex"])
            last_page = min(self.max_pages, int(response["pagination"]["totalPages"]))
            members: list = response["data"]
            print("Received,", len(response["data"]), "members from page", response["pagination"]["pageIndex"], "over", response["pagination"]["totalPages"])
            for _ in list(range(first_page, last_page)):
                params["pageIndex"] += 1
                raw_response = requests.get(url, headers=headers, params=params)  # retrieve page 2 and above
                if raw_response.ok:
                    response = raw_response.json()
                    members.extend(response["data"])
                    print("Received,", len(response["data"]), f"members from page {response['pagination']['pageIndex']}/{response['pagination']['totalPages']}")
                else:
                    raise IOError(f"Retrieving page failed with HTTP error {raw_response.status_code} from HelloAsso")
            return members
        print(f"Failed to get HelloAsso members:", raw_response.text)

    def save_to_json(self, all_our_members: list[HelloAssoMemberEntry]):
        with open("all_our_members.json", "w") as f:
            dump(all_our_members, f, indent=4)

    @staticmethod
    def get_first_hello_date(x: HelloAssoMemberEntry) -> datetime:
        return datetime.fromisoformat(x['order']['meta']['createdAt'].split('.')[0])

    @staticmethod
    def get_last_hello_date(x: HelloAssoMemberEntry, membership_duration: int) -> datetime:
        return HelloAssoMembersAPI.get_first_hello_date(x) + timedelta(membership_duration)

    def crush_and_remove_duplicates(self, hellomem: list[HelloAssoMemberEntry]) -> dict:
        hello_dict = {}
        num_hello_duplicates = 0
        for hellom in hellomem:
            if "user" not in hellom:
                continue
            full_name = crush(hellom['user']['firstName']) + crush(hellom['user']['lastName'])
            if full_name in hello_dict:
                num_hello_duplicates += 1
                if self.get_last_hello_date(hellom, self.membership_duration) > self.get_last_hello_date(hello_dict[full_name], self.membership_duration):
                    hello_dict[full_name] = hellom
            else:
                hello_dict[full_name] = hellom
        print(f"{num_hello_duplicates} duplicates ignored in HelloAsso")
        return hello_dict

    def remove_old_syncs(self, hello_dict: dict[str, HelloAssoMemberEntry], now: Optional[datetime] = None):
        to_be_deleted = []
        for member_name, hellom in hello_dict.items():
            now = now if now is not None else datetime.now()
            if now - HelloAssoMembersAPI.get_first_hello_date(hellom) > self.max_sync:
                to_be_deleted.append(member_name)

        return {k: v for k, v in hello_dict.items() if k not in to_be_deleted}
