import unittest
from hello_doli_gateway.gateway import HelloToDoliGateway
from hello_doli_gateway.helloasso.api import HelloAssoMembersAPI
from hello_doli_gateway.dolibarr.api import DolibarrRESTAPI
from datetime import timedelta


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


class GatewayTest(unittest.TestCase):
    def test_insertions_with_push_subscriptions(self):
        types = {4242: 1}
        custom_fields = {}
        max_sync = timedelta(days=365)
        min_diff = timedelta(days=3)
        full_name = "anneonyme"
        hello = HelloAssoMembersAPI("", "", 365, 1, max_sync)
        doli = DolibarrRESTAPI("", "", 1)
        gateway = HelloToDoliGateway(None, types, custom_fields, 365, min_diff)
        hello_member_stub = {'order': {'id': 126885,
                                       'meta': {'createdAt': '2023-10-02T20:31:18.8605431+01:00',
                                                'updatedAt': '2023-10-02T20:31:22.3762245+01:00'},
                                       'isAnonymous': False,
                                       'isAmountHidden': False},
                             'user': {'firstName': 'Anne ', 'lastName': 'Onyme'},
                             'tierId': list(types.keys())[0],
                             'initialAmount': 10000,
                             'state': 'Processed'}
        h_members = hello.crush_and_remove_duplicates([hello_member_stub])  # FIXME type checking fails here bcz stub too short
        d_members = doli.crush_and_remove_duplicates([doli_member_stub])
        num_insertions_members = gateway.convert_subscriptions(h_members, d_members)
        self.assertEqual(num_insertions_members, 0,
                         "push_subscriptions() should have skipped too close end dates but did not")

        doli_member_stub['datefin'] = 1597886620
        d_members = doli.crush_and_remove_duplicates([doli_member_stub])
        num_insertions_members = gateway.convert_subscriptions(h_members, d_members)
        self.assertEqual(num_insertions_members, 1,
                         "push_subscriptions() should have inserted far end dates but did not")
        self.assertEqual("subscription" in gateway.members_to_push[full_name], True,
                         "push_subscriptions() should have inserted far end dates but did not")
        self.assertEqual("member" in gateway.members_to_push[full_name], False,
                         "push_subscriptions() should have not inserted already existing member but inserted it")


if __name__ == '__main__':
    unittest.main()
