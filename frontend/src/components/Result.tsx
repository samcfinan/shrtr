import { Component, createSignal } from "solid-js";

const Input: Component<{
  result: string | undefined;
  setResult: (data: string | undefined) => void;
}> = (props) => {
  const copyToClipboard = () => {
    if (props.result) {
      navigator.clipboard.writeText(props.result);
    }
  };

  return (
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Shrtr: Generate a short URL
        </h2>
      </div>
      <div class="mt-8 space-y-6">
        <div class="mt-4"></div>
        <div class="rounded-md shadow-sm">
          <label for="url" class="sr-only">
            URL
          </label>
          <div class="flex flex-row">
            <input
              id="url"
              name="url"
              type="text"
              required
              readOnly
              disabled
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="https://my-example-domain.tld"
              value={props.result}
            />
            <button
              type="submit"
              class="relative px-4 border text-sm font-medium background-gray-700"
              onClick={() => copyToClipboard()}
            >
              Copy
            </button>
          </div>
          <button
            type="submit"
            class="relative mt-3 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => props.setResult(undefined)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
