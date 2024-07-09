## Configuration

Create a file `./packages.tsconfig.json` inside hotReload directory (you can reuse `./packages.tsconfig.example.json`)
and insert all the packages you want to be hot reloaded and their paths on your machine.

e.g.

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@opentalk/redux-oidc": ["../../packages/redux-oidc"]
      // ... insert more, if you like
    }
  }
}
```

For now avaliable packages for hot reload are:

1. @opentalk/rest-api-rtk-query
2. @opentalk/redux-oidc
