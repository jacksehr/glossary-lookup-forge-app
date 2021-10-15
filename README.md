# Forge Glossary Lookup App
This app allows Confluence users to lookup terms and acronyms from any document, through the context menu.

## Forge?
For information on Forge, go to https://developer.atlassian.com/platform/forge/.

## How to use
The manifest has the app id truncated so this app is re-usable, so you'll need to register it first:
```
forge register
```

You'll then need to deploy and install the app on your Atlassian site, as per the instructions available at the above Forge docs link.

You'll then need to set up a Confluence page to use as the glossary, with a 2-column table:
- The left column will be your terms
- The right columns will be the corresponding definitions

You'll need the `id` of that page (can be found from the URL e.g. `https://company.atlassian.net/wiki/spaces/<some space>/pages/<ID HERE>`).

This `id` needs to be set as a Forge environment variable named `GLOSSARY_PAGE_ID`:
```
forge variables set GLOSSARY_PAGE_ID <page_id>
```

Additionally, you'll also need a storage key for caching the glossary. It's not terribly important what you choose to make this, but it needs to be set under the name `GLOSSARY_STORAGE_KEY`:
```
forge variables set GLOSSARY_STORAGE_KEY <your_key_here>
```