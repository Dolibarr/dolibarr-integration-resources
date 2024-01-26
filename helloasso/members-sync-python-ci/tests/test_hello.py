import unittest
from hello_doli_gateway.helloasso.moke import HelloAssoMembersMokeAPI
from datetime import timedelta, datetime
from copy import copy
from random import shuffle


hello_member_stub = {'order': {'id': 126885,
  'date': '2021-11-02T20:31:22.3762245+01:00',
  'formSlug': 'form-slug',
  'formType': 'Membership',
  'organizationName': 'Org Name',
  'organizationSlug': 'org-name',
  'formName': 'Form Name',
  'meta': {'createdAt': '2023-11-02T20:31:18.8605431+01:00', 'updatedAt': '2023-11-02T20:31:22.3762245+01:00'},
  'isAnonymous': False,
  'isAmountHidden': False},
 'payer': {'email': 'payer@example.org',
  'country': 'FRA',
  'firstName': 'Anne',
  'lastName': 'Payer'},
 'payments': [{'cashOutState': 'Transfered',
   'shareAmount': 10000,
   'id': 7748400,
   'amount': 10000,
   'date': '2021-11-02T20:31:21.9387173+01:00',
   'paymentMeans': 'Card',
   'installmentNumber': 1,
   'state': 'Authorized',
   'meta': {'createdAt': '2021-11-02T20:31:18.8605431+01:00',
    'updatedAt': '2021-11-02T20:31:22.0168448+01:00'},
   'refundOperations': []}],
 'name': 'Plein tarif',
 'user': {'firstName': 'Anne ', 'lastName': 'User'},
 'priceCategory': 'Fixed',
 'customFields': [{'id': 783,
   'name': 'Phone number',
   'type': 'TextInput',
   'answer': '+33612121212'},
  {'id': 751,
   'name': 'City',
   'type': 'TextInput',
   'answer': 'Paris'}],
 'qrCode': 'NzI3NjY4ODU4MzQ1NT4MztmLl',
 'membershipCardUrl': 'https://www.helloasso.com/associations/some_card.pdf',
 'tierDescription': "Tiers description",
 'tierId': 1043812,
 'id': 96710885,
 'amount': 10000,
 'type': 'Membership',
 'initialAmount': 10000,
 'state': 'Processed'}


class HelloassoTest(unittest.TestCase):
    def test_duplication_removal(self):
        hello = HelloAssoMembersMokeAPI("", "", 365, 1, max_sync=timedelta(days=1))
        hello_member_old = copy(hello_member_stub)
        hello_member_new = copy(hello_member_stub)
        hello_member_old['order']['meta']['createdAt'] = '2021-11-02T20:31:18.8605431+01:00'
        hello_members = [hello_member_old, hello_member_new]
        shuffle(hello_members)
        hello_dict = hello.crush_and_remove_duplicates(hello_members)
        self.assertEqual(hello_dict['anneuser']['order']['meta']['createdAt'],
                         hello_member_new['order']['meta']['createdAt'],
                         "crush_and_remove_duplicates() on duplicate hello member should have selected the newest but did not")

    def test_too_ancient_membership(self):
        max_date = 2
        hello = HelloAssoMembersMokeAPI("", "", 365, 1, max_sync=timedelta(days=max_date))
        now = datetime.fromisoformat(hello_member_stub['order']['meta']['createdAt'].split('.')[0]) + timedelta(days=max_date+1)
        output = hello.crush_and_remove_duplicates([hello_member_stub])
        output = hello.remove_old_syncs(output, now=now)
        self.assertEqual(len(output), 0, "remove_old_syncs() must have dropped old HelloAsso entries but did not")
        hello.max_sync = timedelta(days=max_date+1)
        output = hello.crush_and_remove_duplicates([hello_member_stub])
        output = hello.remove_old_syncs(output, now=now)
        self.assertEqual(len(output), 1, "remove_old_syncs() must have inserted recent HelloAsso entries but did not")


if __name__ == '__main__':
    unittest.main()
