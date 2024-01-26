# Configuration files for the HelloAsso to Dolibarr import script
Here is how to configure the script before you can. Editing membership types is compulsory since it depends on your own types.

## Membership types (compulsory)
This dictionary stores the match between HelloAsso tier IDs (e.g. full price, half price, free for job seekers, ...) and Dolibarr member type IDs.

Use these methods to help yourself:
* Find the HelloAsso tier IDs this way:
  * Load the developer tools on your browser logged to an HelloAsso administrator account of your organization (F12 on Mozilla Firefox)
  * Click on the Network tab
  * Replace the slugs with your membership form in https://admin.helloasso.com/<org-slug>/adhesions/<form-slug>/edition/2 and load it
  * Identify the `tiers` file returning a JSON type, and browse all the available tiers in the `Response` tab, the tier ID is in the field named `id:`
* Find the Dolibarr Type ID at the first row of the type list: https://<dolibarr.example.com>/adherents/type.php

You can get rid of the `424242: 1` entry that is given as an example only.

## General configuration (optional)
Edit `config.json` as follows:

### `max_pages` 
Maximum number of pages to download from HelloAsso and Dolibarr. With 100 members downloaded per page.
Mainly a sanity check.

### `min_diff_days`, integer
Do not synchronize if expiration dates in are below this difference.
Allows to absorb manual slight errors in manual insertions.

### `max_sync_days`, integer
Synchonize only HelloAsso memberships that are more recent that this date.
If this is your first run and if you have e.g. 3 years of memberships to synchronize, you will have to increase that value to 3*365.
When the syncing is performed on a regular basis (e.g. weekly), you can reduce that value (e.g. to 30 days) to save execution time.
Include some margin in case execution fails some day. (e.g. 4x factor in the example in brackets).

### `membership_duration_days`, integer
Duration of all membership types, in days (usually 365).

## HelloAsso custom fields (optional)
If you have created custom fields in HellAsso (e.g. post address, ...), you may want to push them into the Dolibarr database too.
That dictionary stores, for each custom field that you have created, the destination field in Dolibarr.
Refer to the Dolibarr REST API doc in order to know the possible destination fields.

**Note**: Since HelloAsso has a compulsory e-mail only for the payer, you will not have a user e-mail in Dolibarr if you do not request a user e-mail as a custom field.
