from .api import HelloAssoMembersAPI
from json import load


class HelloAssoMembersMokeAPI(HelloAssoMembersAPI):
    def connect_oauth(self):
        pass

    def get_helloasso_members(self, organization_slug: str, form_slug: str) -> list:
        with open("all_our_members.json") as f:
            return load(f)
