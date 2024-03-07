from json import load
from os import environ
from datetime import timedelta
from hello_doli_gateway.dolibarr.api import DolibarrRESTAPI
from hello_doli_gateway.helloasso.api import HelloAssoMembersAPI
from hello_doli_gateway.gateway import HelloToDoliGateway
from hello_doli_gateway.conventions import ConfigurationError

try:
    dolibarr_rest_token = environ['DOLIBARR_REST_TOKEN']
    dolibarr_base_url = environ['DOLIBARR_BASE_URL']
    helloasso_client_id = environ['HELLOASSO_CLIENT_ID']
    helloasso_client_secret = environ['HELLOASSO_CLIENT_SECRET']
    helloasso_organization_slug = environ['HELLOASSO_ORG_SLUG']
    helloasso_form_slug = environ['HELLOASSO_FORM_SLUG']
except KeyError as e:
    raise ConfigurationError(f"Environment variable {str(e)} not found, set it before running.")

# Does not modify the Dolibarr database through API calls
dry_run = False if 'HELLODOLI_DRY_RUN' in environ and environ['HELLODOLI_DRY_RUN'].lower() == 'false' else True


if __name__ == "__main__":
    with open("config/types.json") as f:
        #  HellAsso Tier Id (str key representing an integer): Dolibarr Type Id (int value)
        types: dict[str, int] = load(f)

    with open("config/custom_fields.json") as f:
        # Dolibarr member field (str key): HelloAsso custom field (str value)
        custom_fields: dict[str, str] = load(f)

    with open("config/config.json") as f:
        # Other configuration variables
        config: dict = load(f)
        min_diff = timedelta(days=config['min_diff_days'])
        max_sync = timedelta(days=config['max_sync_days'])

    hello = HelloAssoMembersAPI(helloasso_client_id, helloasso_client_secret,
                                    config['membership_duration_days'], config['max_pages'], max_sync)
    hello.connect_oauth()
    # print(hello.token)
    all_our_members = hello.get_helloasso_members(helloasso_organization_slug, helloasso_form_slug)
    all_our_members_dict = hello.crush_and_remove_duplicates(all_our_members)
    all_our_members_dict = hello.remove_old_syncs(all_our_members_dict)
    # hello.save_to_json(all_our_members)

    doli = DolibarrRESTAPI(dolibarr_base_url, dolibarr_rest_token, config['max_pages'])
    all_our_doli_members = doli.get_members_and_subscriptions()
    all_our_doli_members_dict = doli.crush_and_remove_duplicates(all_our_doli_members)
    # doli.save_to_json(all_our_doli_members)

    gateway = HelloToDoliGateway(doli, types, custom_fields, config['membership_duration_days'], min_diff)

    num_insertions_members = gateway.convert_subscriptions(all_our_members_dict, all_our_doli_members_dict)
    if num_insertions_members > 0 and not dry_run:
        gateway.push_subscriptions()

    print(f"{num_insertions_members} subscriptions affected with dry run {'en' if dry_run else 'dis'}abled")