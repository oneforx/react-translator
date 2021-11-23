This library was generated with [Nx](https://nx.dev).

# @oneforx/react-translator
This library is intent to be used as a translator of predefined json file that can be created with [react-translator-gui](https://oneforx.net/react-translator/) website

## locales.json
```json 
{"translate_key":{"fr":"Je suis une traduction","au":"I'm a translation"}}
```

## Example of initialisation
import locales from './locales.json'

```jsx
  const ExampleComponent = () => {
    const translateKey = useTranslator("translate_key");

    return (
      <div>{translateKey}<div>
    )
  }
```

```jsx
  const ExampleComponent2 = () => {
    const translated = useTranslator();

    return (
      <div>{translated["translate_key"]}<div>
    )
  }
```

```jsx
  const App = () => {
    return (
      <ReactTranslatorContextProvider locales={locales}>
        {/**Your components*/}
      </ReactTranslatorContextProvider>
    );
  }
```
