from ..conventions import crush
import requests
from json import dump
from typing import TypedDict, Optional
from datetime import datetime


class DolibarrMemberEntry(TypedDict):
    """
    Entry of a member returned by the Dolibarr REST API
    """
    statut: int
    status: int
    note_public: Optional[str]
    note_private: Optional[str]
    name: Optional[str]
    lastname: str
    firstname: Optional[str]
    civility_id: Optional[int]
    login: Optional[str]
    address: Optional[str]
    zip: Optional[int]
    town: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    phone_perso: Optional[str]
    phone_pro: Optional[str]
    phone_mobile: Optional[str]
    fax: Optional[str]
    poste: Optional[str]
    morphy: str
    public: Optional[int]
    default_lang: Optional[str]
    photo: Optional[str]
    gender: Optional[str]
    birth: Optional[str]
    typeid: int
    datefin: Optional[int]


class DolibarrSubscriptionEntry(TypedDict):
    """
    Entry of a member subscription returned by the Dolibarr REST API
    """
    start_date: int
    end_date: int
    amount: float


class DolibarrRESTAPI:
    def __init__(self, base_url: str, token: str, max_pages: int):
        self.max_pages = max_pages
        self.base_url = base_url
        self.headers = {
            "Accept": "application/json",
            "DOLAPIKEY": token
        }

    def get_members_and_subscriptions(self):
        url = f"{self.base_url}/members"
        members = []
        for page in range(self.max_pages):
            params = {
                "limit": 100,
                "page": page
            }
            raw_response = requests.get(url, headers=self.headers, params=params)
            if raw_response.status_code == 404:
                break  # No more page
            elif raw_response.ok:
                print(f"Fetching Dolibarr member page {page + 1}/unknown")
                members.extend(raw_response.json())
            else:
                raise IOError(f"Request to Dolibarr failed with error {raw_response.status_code}")
        return members

    def save_to_json(self, all_our_doli_members: list):
        with open("all_our_doli_members.json", "w") as f:
            dump(all_our_doli_members, f, indent=4)

    @staticmethod
    def get_last_doli_date(x: DolibarrMemberEntry):
        if x['datefin'] == '':
            # Dolibarr returns an empty string when no subscription exist, use an old date in this case
            return datetime.fromtimestamp(0)
        return datetime.fromtimestamp(x['datefin'])

    def crush_and_remove_duplicates(self, dolimem: list[DolibarrMemberEntry]) -> dict[str, DolibarrMemberEntry]:
        # Crush and eliminate duplicates in Dolibarr
        dolibarr_dict = {}
        num_dolibarr_duplicates = 0
        for dolim in dolimem:
            full_name = crush(dolim['firstname']) + crush(dolim['lastname'])
            if full_name in dolibarr_dict:
                num_dolibarr_duplicates += 1
                if self.get_last_doli_date(dolim) < self.get_last_doli_date(dolibarr_dict[full_name]):
                    continue
            dolibarr_dict[full_name] = dolim
        print(f"{num_dolibarr_duplicates} duplicates ignored in Dolibarr")
        return dolibarr_dict
