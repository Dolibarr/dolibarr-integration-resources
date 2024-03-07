"""
This script searches for Dolibarr members with status TERMINATED (Status ID = 0 ; French: résilié) with a valid subscription
These members are likely to be manually switched to a valid membership status
"""
from json import load
from os import environ
from datetime import datetime
from hello_doli_gateway.dolibarr.api import DolibarrRESTAPI
from hello_doli_gateway.conventions import ConfigurationError

try:
    dolibarr_rest_token = environ['DOLIBARR_REST_TOKEN']
    dolibarr_base_url = environ['DOLIBARR_BASE_URL']
except KeyError as e:
    raise ConfigurationError(f"Environment variable {str(e)} not found, set it before running.")

if __name__ == "__main__":
    with open("config/config.json") as f:
        config: dict = load(f)

    doli = DolibarrRESTAPI(dolibarr_base_url, dolibarr_rest_token, config['max_pages'])
    all_our_doli_members = doli.get_members_and_subscriptions()
    all_our_doli_members_dict = doli.crush_and_remove_duplicates(all_our_doli_members)

    status_id_to_seek = str(0)  # Résilié
    num_found = 0
    now = datetime.now().timestamp()
    for name, mem in all_our_doli_members_dict.items():
        if mem['last_subscription_date_end'] is not None and mem['statut'] == status_id_to_seek and int(mem['last_subscription_date_end']) > now:
            diff = int((int(mem['last_subscription_date_end']) - now) / (3600*24))
            print(f"{name} id {mem['id']} has status =  {mem['status']} and statut = {mem['statut']} but their membership is still valid for {diff} days")
            num_found += 1

print(f"{num_found} members found with status {status_id_to_seek} and still a valid subscription")
