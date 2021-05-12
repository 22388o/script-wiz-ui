/* eslint-disable no-template-curly-in-string */
import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import { scriptWizEditor } from "./editor/utils/constant";
import themeOptions from "./editor/options/themeOptions";
import editorOptions from "./editor/options/editorOptions";
import * as languageOptions from "./editor/options/languageOptions";
import "./App.css";

function App() {
  const monaco = useMonaco();

  const onChangeEditor = (value: string | undefined, ev: Monaco.editor.IModelContentChangedEvent) => {
    if (value) {
      let lines = value.split("\n");
      console.log(lines);
      lines = lines.map((line) => line.trim());
      lines = lines.map((line) => line.replaceAll("\r", ""));
      lines = lines.map((line) => line.replaceAll("\t", ""));
      console.log(lines);
    }
  };

  useEffect(() => {
    // language define
    if (monaco !== null) {
      monaco.languages.register({ id: scriptWizEditor.LANGUAGE });

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme(scriptWizEditor.THEME, themeOptions);

      monaco.languages.setLanguageConfiguration(scriptWizEditor.LANGUAGE, languageOptions.languageConfigurations(monaco.languages));

      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider(scriptWizEditor.LANGUAGE, languageOptions.tokenProviders);

      monaco.languages.registerHoverProvider(scriptWizEditor.LANGUAGE, languageOptions.hoverProvider);

      monaco.languages.registerCompletionItemProvider(scriptWizEditor.LANGUAGE, {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = languageOptions.languageSuggestions(monaco.languages, model, position);
          return { suggestions: suggestions };
        },
      });
    }
  }, [monaco]);

  if (monaco != null) {
    return <Editor width="50vw" options={editorOptions} language={scriptWizEditor.LANGUAGE} height="100vh" theme={scriptWizEditor.THEME} onChange={onChangeEditor} />;
  }

  return null;
}

export default App;
