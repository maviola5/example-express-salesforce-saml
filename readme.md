# Example of Express, Passport, Salesforce and SSO with SAML

## Getting started

Create an .env file structured like so:
```
PORT=8888
SAML_ENTRY_POINT=https://your-salesforce-instance.cs71.force.com/idp/endpoint/HttpRedirect
SAML_ISSUER=http://localhost:8888
SAML_IDENTIFIER_FORMAT=urn:oasis:names:tc:SAML:2.0:nameid-format:transient
SAML_PATH=/login/callback
```
## Tips

- Get your certificate from salesforce connected app and follow docs in passport-saml module to use for validation of SAML responses

## References

- [passport](https://github.com/jaredhanson/passport)
- [passport-saml](https://github.com/bergie/passport-saml)
- [Salesforce SSO for connected apps](https://developer.salesforce.com/docs/atlas.en-us.externalidentityImplGuide.meta/externalidentityImplGuide/external_identity_provide_sso_for_web_apps.htm)
- [Overview of SAML](https://developers.onelogin.com/saml)