import unittest
from hello_doli_gateway.dolibarr.moke import DolibarrMokeRESTAPI
from hello_doli_gateway.helloasso.moke import HelloAssoMembersMokeAPI
from datetime import timedelta
from random import shuffle
from copy import copy


doli_member_stub = {
            'module': None,
            'id': '13',
            'entity': '1',
            'import_key': None,
            'array_options': [],
            'array_languages': None,
            'contacts_ids': None,
            'linked_objects': None,
            'linkedObjectsIds': None,
            'oldref': None,
            'canvas': None,
            'fk_project': None,
            'contact_id': None,
            'user': None,
            'origin': None,
            'origin_id': None,
            'ref': '1',
            'ref_ext': None,
            'statut': '0',
            'status': '0',
            'country_id': '1',
            'country_code': 'FR',
            'state_id': None,
            'region_id': None,
            'barcode_type': None,
            'barcode_type_coder': None,
            'mode_reglement_id': None,
            'cond_reglement_id': None,
            'demand_reason_id': None,
            'transport_mode_id': None,
            'shipping_method': None,
            'multicurrency_code': None,
            'multicurrency_tx': None,
            'model_pdf': None,
            'last_main_doc': None,
            'fk_bank': None,
            'fk_account': None,
            'note_public': None,
            'note_private': None,
            'lines': None,
            'name': None,
            'lastname': 'Onyme',
            'firstname': 'Anne',
            'civility_id': None,
            'date_creation': 1647471600,
            'date_validation': '',
            'date_modification': 1697886620,
            'date_update': None,
            'date_cloture': None,
            'user_author': None,
            'user_creation': None,
            'user_creation_id': None,
            'user_valid': None,
            'user_validation': None,
            'user_validation_id': None,
            'user_closing_id': None,
            'user_modification': None,
            'user_modification_id': None,
            'specimen': 0,
            'labelStatus': None,
            'showphoto_on_popup': None,
            'nb': [],
            'output': None,
            'extraparams': [],
            'mesgs': None,
            'login': 'anneonyme',
            'pass_indatabase_crypted': None,
            'fullname': None,
            'civility_code': None,
            'civility': '',
            'societe': None,
            'company': None,
            'fk_soc': None,
            'socid': None,
            'address': '1 rue des Corbeaux',
            'zip': '75000',
            'town': 'PARIS',
            'email': 'hello@example.org',
            'url': None,
            'socialnetworks': [],
            'skype': None,
            'twitter': None,
            'facebook': None,
            'linkedin': None,
            'phone': None,
            'phone_perso': '+33612121212',
            'phone_pro': None,
            'phone_mobile': None,
            'fax': None,
            'poste': None,
            'morphy': 'phy',
            'public': '0',
            'default_lang': None,
            'photo': None,
            'datec': 1647471600,
            'datem': 1697886620,
            'datevalid': '',
            'gender': None,
            'birth': '',
            'typeid': '1',
            'type': 'Plein tarif',
            'need_subscription': '1',
            'user_id': None,
            'user_login': None,
            'datefin': 1727992800,
            'first_subscription_date': 1669223539,
            'first_subscription_date_start': 1647468000,
            'first_subscription_date_end': 1679004000,
            'first_subscription_amount': '100.00000000',
            'last_subscription_date': 1697886620,
            'last_subscription_date_start': 1696370400,
            'last_subscription_date_end': 1696380400,
            'last_subscription_amount': '100.00000000',
            'ip': None,
            'partnerships': []
        }


class DolibarrTest(unittest.TestCase):
    def test_duplication_removal(self):
        doli = DolibarrMokeRESTAPI("", "", 1)
        doli_member_to_push = copy(doli_member_stub)
        doli_member_duplicated = copy(doli_member_stub)
        doli_member_duplicated.update({
            'datec': 1547471600,
            'datem': 1597886620,
            'datefin': 1627992800,
            'first_subscription_date': 1569223539,
            'first_subscription_date_start': 1547468000,
            'first_subscription_date_end': 1579004000,
            'date_creation': 1547471600,
            'date_modification': 1597886620,
        })
        members = [doli_member_to_push, doli_member_duplicated]
        shuffle(members)
        doli_dict = doli.crush_and_remove_duplicates(members)
        self.assertEqual(doli_dict['anneonyme']['datefin'], 1727992800,
                         "crush() on duplicate doli member must have selected the newest entry but didn't")

    def test_no_subscription_exists(self):
        doli = DolibarrMokeRESTAPI("", "", 1)
        doli_member_to_push = copy(doli_member_stub)
        doli_member_existing_with_no_sub = copy(doli_member_stub)
        doli_member_existing_with_no_sub['datefin'] = ''
        members = [doli_member_existing_with_no_sub, doli_member_to_push]
        shuffle(members)
        doli_dict = doli.crush_and_remove_duplicates(members)
        self.assertEqual(doli_dict['anneonyme']['datefin'], doli_member_to_push['datefin'])


if __name__ == '__main__':
    unittest.main()
