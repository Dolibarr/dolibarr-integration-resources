from .dolibarr.api import DolibarrRESTAPI, DolibarrMemberEntry, DolibarrSubscriptionEntry
from .conventions import ConfigurationError
from .helloasso.api import HelloAssoMembersAPI
from datetime import timedelta
from typing import TypedDict, Optional
import requests


class SubscriptionToPush(TypedDict):
    member: Optional[DolibarrMemberEntry]
    fk_adherent: int
    subscription: DolibarrSubscriptionEntry


class HelloToDoliGateway:
    def __init__(self, doli_api: DolibarrRESTAPI, hello_to_doli_types: dict, hello_to_doli_custom_fields: dict,
                 membership_duration: int, min_diff: timedelta):
        self.doli = doli_api
        self.types: dict[str, int] = hello_to_doli_types
        self.fields: dict[str, str] = hello_to_doli_custom_fields
        self.members_to_push: dict[str, SubscriptionToPush] = {}
        self.membership_duration = membership_duration
        self.min_diff = min_diff

    def push_subscriptions(self):
        for full_name, to_be_inserted in self.members_to_push.items():
            if "member" in to_be_inserted:
                raw_resp = requests.post(f"{self.doli.base_url}/members", headers=self.doli.headers, data=to_be_inserted['member'])
                if raw_resp.ok:
                    fk_adherent = raw_resp.json()
                else:
                    # raise exception so that the CI job fails and administrators are warned
                    raise ValueError(f"POST to /members failed with HTTP error {raw_resp.status_code}: {raw_resp.text}")
            else:
                fk_adherent = to_be_inserted['fk_adherent']

            print(f"{self.doli.base_url}/members/{fk_adherent}/subscriptions")
            raw_resp = requests.post(f"{self.doli.base_url}/members/{fk_adherent}/subscriptions",
                                     headers=self.doli.headers, data=to_be_inserted['subscription'])
            if raw_resp.ok:
                fk_subscription = raw_resp.json()
                print(f"inserted subscription {fk_subscription}")
            else:
                # raise exception so that the CI job fails and administrators are warned
                raise ValueError(
                    f"POST to /members/{fk_adherent}/subscriptions failed with HTTP error {raw_resp.status_code}: {raw_resp.text}")

    def convert_subscriptions(self, hello_dict: dict, dolibarr_dict: dict) -> int:
        for full_name, hellom in hello_dict.items():
            self.members_to_push[full_name] = {}
            if full_name not in dolibarr_dict:
                # New member, inexisting in Dolibarr
                print(f"{full_name} is unknown to Dolibarr and must be inserted")
                custom_fields = {field['name']: field['answer'] for field in hellom['customFields']} if 'customFields' in hellom else {}
                status = 1  # 0: résilié, 1: validé, -1: brouillon, -2: exclu
                try:
                    type_id = self.types[str(hellom['tierId'])]
                except KeyError:
                    raise ConfigurationError(f"Tier id {hellom['tierId']} not found in types.json, please configure this file properly.")
                member: DolibarrMemberEntry = {
                    "statut": status,
                    "status": status,
                    "note_public": None,
                    "note_private": None,
                    "name": None,
                    "lastname": hellom['user']['lastName'],
                    "firstname": hellom['user']['firstName'],
                    "civility_id": None,
                    # "login": full_name,
                    "address": None,
                    "zip": None,
                    "town": None,
                    "email": None,
                    "phone": None,
                    "phone_perso": None,
                    "phone_pro": None,
                    "phone_mobile": None,
                    "fax": None,
                    "poste": None,
                    "morphy": "phy",
                    "public": "0",
                    "default_lang": None,
                    "photo": None,
                    "gender": None,
                    "birth": "",
                    "typeid": type_id
                }
                # Inserting custom fields, if any
                for doli_field, hello_field in self.fields.items():
                    member[doli_field] = custom_fields[hello_field]
                self.members_to_push[full_name]['member'] = member
            else:
                dolim = dolibarr_dict[full_name]
                delta = abs(HelloAssoMembersAPI.get_last_hello_date(hellom, self.membership_duration) -
                            DolibarrRESTAPI.get_last_doli_date(dolim))
                if delta > self.min_diff:
                    self.members_to_push[full_name]['fk_adherent'] = int(dolim['id'])
                    print(f"{full_name} already exists in Dolibarr, thus a new subscription must be inserted")
                else:
                    print(f"{full_name} exists in Dolibarr but does not need a subscription insertion because "
                          f"delta ({delta.days} days) <= min_diff ({self.min_diff.days} days) ")
                    del self.members_to_push[full_name]
                    continue

            # Whatever the member is known or newly inserted, update his contribution in Dolibarr
            subscription: DolibarrSubscriptionEntry = {
                "start_date": int(HelloAssoMembersAPI.get_first_hello_date(hellom).timestamp()),
                "end_date": int(HelloAssoMembersAPI.get_last_hello_date(hellom, self.membership_duration).timestamp()),
                "amount": hellom['initialAmount'] / 100  # HelloAsso money amounts are integers with cents
            }
            print(f"Inserting subscription {subscription} for {full_name}")
            self.members_to_push[full_name]['subscription'] = subscription
        return len(self.members_to_push)
