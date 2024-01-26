from .api import DolibarrRESTAPI
from json import load


class DolibarrMokeRESTAPI(DolibarrRESTAPI):
    def get_members_and_subscriptions(self) -> list:
        with open("all_our_doli_members.json") as f:
            return load(f)
