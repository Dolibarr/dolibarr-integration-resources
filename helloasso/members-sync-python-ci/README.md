[![GPL-3.0 License][gpl-3.0-shield]][gpl-3.0]

# HelloAsso memberships to Dolibarr

This project is intended to import subscriptions of members of non-profits from the HelloAsso frontend portal to the Dolibarr ERP/CRM, using their respective REST API. This operation can be automated to run daily or weekly.

Managing your members in Dolibarr has several benefits, e.g.:
- Send automated reminders of membership expiration
- Keep track of membership renewals and the history of renewals over the years
- Connect your members with all the features of the ERP, e.g. expense tickets, invoices, login 

## Getting started

Enabling this synchronization requires a bit of technical ease.

### Step 1: Retrieve the code and install 
It is best to create a virtual environment first.

```bash
git clone https://github.com/Dolibarr/dolibarr-integration-resources/
cd dolibarr-integration-resources/helloasso/
pip install members-sync-python-ci/
```

### Step 2: Configure

* In Dolibarr, enable the REST API module in the and generate an API secret from a new user dedicated to automation, with only the membership rights.
* In HelloAsso, generate an API token
* From the URL of the membership form in HelloAsso, get the slugs: `https://www.helloasso.com/associations/your-organization-slug/adhesions/the-slug-of-your-membership-form`
* Configure the following environment variables:
  ```bash
  export HELLOASSO_CLIENT_ID="your-hexadecimal-client-id"
  export HELLOASSO_CLIENT_SECRET="your-secret"
  export HELLOASSO_ORG_SLUG="your-organization-slug"
  export HELLOASSO_FORM_SLUG="the-slug-of-your-membership-form"
  export DOLIBARR_REST_TOKEN="your-token"
  export DOLIBARR_BASE_URL="https://dolibarr.example.com/api/index.php"
  export HELLODOLI_DRY_RUN=true
  ```
* Configure the configuration files, see [config/README](./config/README.md)

### Step 3: Option A: Run synchronization manually

```commandline
python push_helloasso_members_to_dolibarr.py
```

⚠️ By default, dry run is enabled and will not push anything to Dolibarr.
Switch `HELLODOLI_DRY_RUN` to `false` in production.


### Step 3: Option B: Use GitLab CI to automate synchronization
If you have a GitLab account and know pieces of CI/CD automation, you can make GitLab run synchronization on a regular basis.

* Fork the current repository and define it as **private** so that the logs of CI jobs do not leak sensitive data
* Commit the edited configuration files (JSON) onto your production branch (e.g. `main`)
* Settings > CI/CD > Variables > Set the here above environment variables on the protected branch `main` (cf [doc](https://docs.gitlab.com/ee/ci/variables/#for-a-project))
* Build > Pipeline schedules > New schedule > Enable a daily or weekly run (cf [doc](https://docs.gitlab.com/ee/ci/pipelines/schedules.html))
* Then click PLAY to test the pipeline once or wait for the next daily trigger

## Remarks
### Collision of member names
The HelloAsso and Dolibarr members are matched according to their full name (first name + last name), not their e-mail. The script makes the hypothesis that collision risk is negligible.
Although matching on e-mail could be added as an option, HelloAsso does not make compulsory the user e-mail (only the payer e-mail) so that would not suit all cases.

### Leak of sensitive information
The use of the automated pipeline on the CI/CD on a **public** repository might leak some personal information about your members in the Jobs section.
Although jobs can be manually cleared, you probably want to make your repository private instead.

### Original repo
See https://gitlab.eirlab.net/automation/helloasso-memberships-to-dolibarr

[gpl-3.0-shield]: https://img.shields.io/badge/License-GPL%203.0-blue.svg
[gpl-3.0]: https://opensource.org/licenses/GPL-3.0
