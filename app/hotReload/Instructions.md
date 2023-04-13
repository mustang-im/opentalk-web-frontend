## Configuration

1. Create a file `./components.alias.json` inside hotReload directory

with this information

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@opentalk/components": ["../../../componentes"]
    }
  }
}
```

- `["../../../componentes"]` - should match the path to your local components directory

2. Match @opentalk/common version in your local /components library

- go to your local @opentalk/components/package.json
- modify devDependency version of @opentalk/common to match your local latest version (monorepo/packages/common/package.json)
- install the updated dependency

```bash
   yarn install
```

3. Delete all build files in your local @opentalk/components (/dist - folder)

```bash
   rm -rf dist
```

4. run the frontend app

```bash
   yarn start:hot
```
