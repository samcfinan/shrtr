import { Component, createSignal, Show } from "solid-js";

import "tailwindcss/tailwind.css";
import Input from "./components/Input";
import Result from "./components/Result";

const App: Component = () => {
  const [result, setResult] = createSignal<string | undefined>();

  return (
    <div>
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Show when={result()}>
          <Result result={result()} setResult={setResult} />
        </Show>
        <Show when={!result()}>
          <Input setResult={setResult} />
        </Show>
      </div>
    </div>
  );
};

export default App;
