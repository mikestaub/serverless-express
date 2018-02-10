# :package: :sparkles: Serverless Express
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

Make express apps compatible with serverless framework. 
Ensure compatibility with serverless-offline plugin.

Works with provider :
- [x] Amazon Web Service - Lambda
- [ ] Google Cloud Platform - Cloud functions <span style="color:lightgrey"> in development </span>
- [ ] Microsoft Azure - Cloud functions <span style="color:lightgrey"> in development </span>

## Instalation

`npm install --save serverless-express`

## Usage

### First, add it to serverless.yml

inside your project's serverless.yml file add ``` serverless-express`` to the plugin list inside serverless.yml

It should look something like this:

```YAML
plugins:
  - serverless-offline
  - serverless-express # <- like so
```

### then, in your hanlder file ...
