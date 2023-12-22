/* eslint-disable react/no-unescaped-entities */
import { Page } from '@/components/Page'

type UiDemoProps = {
  props?: any
}

const tints1 = [
  '#FFB8BE',
  '#FFAAA8',
  '#FF8E80',
  '#FF7F5C',
  '#FF7433',
  '#F97315',
  '#D64400',
  '#A32300',
  '#6B0C00',
  '#380100',
  '#190002',
]

const tints2 = [
  '#FAEBF1',
  '#F7D9E0',
  '#F2ABB1',
  '#F1877E',
  '#F1744B',
  '#F97315',
  '#C73D0F',
  '#941B10',
  '#5D0E15',
  '#2F0913',
  '#14050B',
]

const paletteblock = (clr: string[]) => {
  return (
    <div className="flex">
      {clr.map((c) => (
        <div key={c} className="h-10 w-20" style={{ backgroundColor: c }}>
          {c}
        </div>
      ))}
    </div>
  )
}

export const UiDemoPage = ({ props }: UiDemoProps) => {
  return (
    <Page className="flex flex-col gap-4 p-6">
      <div>
        {/* palette test */}
        <div className="flex">
          {[
            '#fafaf9',
            '#f5f5f4',
            '#e7e5e4',
            '#d6d3d1',
            '#a8a29e',
            '#78716c',
            '#57534e',
            '#44403c',
            '#292524',
            '#1c1917',
            '#0c0a09',
          ].map((clr) => (
            <div key={clr} className="h-10 w-20" style={{ backgroundColor: clr }}>
              {clr}
            </div>
          ))}
        </div>

        <div className="flex">
          {[
            '#fff7ed',
            '#ffedd5',
            '#fed7aa',
            '#fdba74',
            '#fb923c',
            '#f97315',
            '#ea590c',
            '#c2410c',
            '#9a3412',
            '#7c2d12',
            '#431407',
          ].map((clr) => (
            <div key={clr} className="h-10 w-20" style={{ backgroundColor: clr }}>
              {clr}
            </div>
          ))}
        </div>

        {paletteblock(tints1)}
        {paletteblock(tints2)}
      </div>
      <div className="flex gap-4">
        <div className="flex -space-x-2">
          <img
            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
            alt="Image Description"
          />
          <img
            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
            alt="Image Description"
          />
          <img
            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80"
            alt="Image Description"
          />
          <img
            className="inline-block h-[2.875rem] w-[2.875rem] rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
            alt="Image Description"
          />
          <div className="hs-dropdown relative inline-flex [--placement:top-left]">
            <button
              id="hs-avatar-group-dropdown"
              className="hs-dropdown-toggle inline-flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-full border-2 border-white bg-white align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-300 focus:bg-blue-100 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-800 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-blue-100 dark:focus:text-blue-600 dark:focus:ring-offset-gray-800"
            >
              <span className="font-medium leading-none">9+</span>
            </button>

            <div
              className="hs-dropdown-menu z-10 mb-2 hidden w-48 rounded-lg bg-white p-2 opacity-0 shadow-md transition-[margin,opacity] duration-300 hs-dropdown-open:opacity-100 dark:divide-gray-700 dark:border dark:border-gray-700 dark:bg-gray-800"
              aria-labelledby="hs-avatar-group-dropdown"
            >
              <a
                className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                href="#"
              >
                Chris Lynch
              </a>
              <a
                className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                href="#"
              >
                Maria Guan
              </a>
              <a
                className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                href="#"
              >
                Amil Evara
              </a>
              <a
                className="flex items-center gap-x-3.5 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                href="#"
              >
                Ebele Egbuna
              </a>
            </div>
          </div>
        </div>

        {/* spinnerz */}
        <div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-gray-800 dark:text-white"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-gray-400"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-red-600"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-yellow-600"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-green-600"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600 dark:text-blue-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-indigo-600"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-purple-600"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-pink-600"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-orange-600"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>

        {/* slider */}
        <div>
          <label htmlFor="basic-range-slider-usage" className="sr-only">
            Example range
          </label>
          <input
            type="range"
            className="w-full cursor-pointer appearance-none bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50
[&::-moz-range-thumb]:h-2.5
[&::-moz-range-thumb]:w-2.5
[&::-moz-range-thumb]:appearance-none
[&::-moz-range-thumb]:rounded-full
[&::-moz-range-thumb]:border-4
[&::-moz-range-thumb]:border-blue-600
[&::-moz-range-thumb]:bg-white
[&::-moz-range-thumb]:transition-all
[&::-moz-range-thumb]:duration-150
[&::-moz-range-thumb]:ease-in-out
[&::-moz-range-track]:h-2

[&::-moz-range-track]:w-full
[&::-moz-range-track]:rounded-full
[&::-moz-range-track]:bg-gray-100
[&::-webkit-slider-runnable-track]:h-2
[&::-webkit-slider-runnable-track]:w-full
[&::-webkit-slider-runnable-track]:rounded-full
[&::-webkit-slider-runnable-track]:bg-gray-100
[&::-webkit-slider-runnable-track]:dark:bg-gray-700
[&::-webkit-slider-thumb]:-mt-0.5
[&::-webkit-slider-thumb]:h-2.5

[&::-webkit-slider-thumb]:w-2.5
[&::-webkit-slider-thumb]:appearance-none
[&::-webkit-slider-thumb]:rounded-full
[&::-webkit-slider-thumb]:bg-white
[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)]

[&::-webkit-slider-thumb]:transition-all
[&::-webkit-slider-thumb]:duration-150
[&::-webkit-slider-thumb]:ease-in-out
[&::-webkit-slider-thumb]:dark:bg-slate-700"
            id="basic-range-slider-usage"
          />
        </div>

        {/* number input */}
        {/* Input Number */}
        <div
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-slate-900"
          data-hs-input-number
        >
          <div className="flex w-full items-center justify-between gap-x-3">
            <div>
              <span className="block text-sm font-medium text-gray-800 dark:text-white">
                Additional seats
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">$39 monthly</span>
            </div>
            <div className="flex items-center gap-x-1.5">
              <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center gap-x-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                data-hs-input-number-decrement
              >
                <svg
                  className="h-3.5 w-3.5 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
              <input
                className="w-6 border-0 bg-transparent p-0 text-center text-gray-800 focus:ring-0 dark:text-white"
                type="text"
                defaultValue={0}
                data-hs-input-number-input
              />
              <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center gap-x-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                data-hs-input-number-increment
              >
                <svg
                  className="h-3.5 w-3.5 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* End Input Number */}

        {/* tabs */}
        <div>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
              <button
                type="button"
                className="active inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50 hs-tab-active:border-blue-600 hs-tab-active:font-semibold hs-tab-active:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                id="tabs-with-badges-item-1"
                data-hs-tab="#tabs-with-badges-1"
                aria-controls="tabs-with-badges-1"
                role="tab"
              >
                Tab 1{' '}
                <span className="ms-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800 hs-tab-active:bg-blue-100 hs-tab-active:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hs-tab-active:bg-blue-800 dark:hs-tab-active:text-white">
                  99+
                </span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50 hs-tab-active:border-blue-600 hs-tab-active:font-semibold hs-tab-active:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                id="tabs-with-badges-item-2"
                data-hs-tab="#tabs-with-badges-2"
                aria-controls="tabs-with-badges-2"
                role="tab"
              >
                Tab 2{' '}
                <span className="ms-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800 hs-tab-active:bg-blue-100 hs-tab-active:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hs-tab-active:bg-blue-800 dark:hs-tab-active:text-white">
                  99+
                </span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm text-gray-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none disabled:pointer-events-none disabled:opacity-50 hs-tab-active:border-blue-600 hs-tab-active:font-semibold hs-tab-active:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                id="tabs-with-badges-item-3"
                data-hs-tab="#tabs-with-badges-3"
                aria-controls="tabs-with-badges-3"
                role="tab"
              >
                Tab 3
              </button>
            </nav>
          </div>
          <div className="mt-3">
            <div id="tabs-with-badges-1" role="tabpanel" aria-labelledby="tabs-with-badges-item-1">
              <p className="text-gray-500 dark:text-gray-400">
                This is the{' '}
                <em className="font-semibold text-gray-800 dark:text-gray-200">first</em> item's tab
                body.
              </p>
            </div>
            <div
              id="tabs-with-badges-2"
              className="hidden"
              role="tabpanel"
              aria-labelledby="tabs-with-badges-item-2"
            >
              <p className="text-gray-500 dark:text-gray-400">
                This is the{' '}
                <em className="font-semibold text-gray-800 dark:text-gray-200">second</em> item's
                tab body.
              </p>
            </div>
            <div
              id="tabs-with-badges-3"
              className="hidden"
              role="tabpanel"
              aria-labelledby="tabs-with-badges-item-3"
            >
              <p className="text-gray-500 dark:text-gray-400">
                This is the{' '}
                <em className="font-semibold text-gray-800 dark:text-gray-200">third</em> item's tab
                body.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* cards */}
      <div className="flex gap-4">
        {/* 1 */}
        <div className="flex w-96 flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7]">
          <img
            className="h-auto w-full rounded-t-xl"
            src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80"
            alt="Image Description"
          />
          <div className="p-4 md:p-5">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Card title</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Some quick example text to build on the card title and make up the bulk of the cards
              content.
            </p>
            <a
              className="mt-2 inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              Go somewhere
            </a>
          </div>
        </div>
        {/* 2 */}
        <div className="flex flex-col rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7]">
          {/* Select (Mobile only) */}
          <div className="sm:hidden">
            <label htmlFor="hs-card-nav-tabs" className="sr-only">
              Select a nav
            </label>
            <select
              name="hs-card-nav-tabs"
              id="hs-card-nav-tabs"
              className="block w-full rounded-t-xl border-x-0 border-t-0 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            >
              <option selected>My Account</option>
              <option>Company</option>
              <option>Team Members</option>
              <option>Billing</option>
            </select>
          </div>
          {/* End Select (Mobile only) */}
          {/* Nav Tabs (Device only) */}
          <div className="hidden sm:block">
            <nav
              className="relative z-0 flex divide-x divide-gray-200 rounded-xl border-b dark:divide-gray-700 dark:border-gray-700"
              aria-label="Tabs"
            >
              <a
                className="group relative min-w-0 flex-1 overflow-hidden rounded-ss-xl border-b-2 border-b-blue-600 bg-white px-4 py-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:text-gray-300"
                aria-current="page"
                href="#"
              >
                My Account
              </a>
              <a
                className="group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 focus:z-10 dark:bg-gray-800 dark:hover:text-gray-400"
                href="#"
              >
                Company
              </a>
              <a
                className="group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 focus:z-10 dark:bg-gray-800 dark:hover:text-gray-400"
                href="#"
              >
                Team Members
              </a>
              <a
                className="group relative min-w-0 flex-1 overflow-hidden rounded-se-xl bg-white px-4 py-4 text-center text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 focus:z-10 dark:bg-gray-800 dark:hover:text-gray-400"
                href="#"
              >
                Billing
              </a>
            </nav>
          </div>
          {/* End Nav Tabs (Device only) */}
          <div className="p-4 text-center md:px-5 md:py-7">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Card title</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              With supporting text below as a natural lead-in to additional content.
            </p>
            <a
              className="mt-3 inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              Go somewhere
            </a>
          </div>
        </div>

        {/* chat */}
        {/* Chat Bubble */}
        <ul className="w-96 space-y-5">
          {/* Chat */}
          <li className="me-11 flex max-w-lg gap-x-2 sm:gap-x-4">
            <img
              className="inline-block h-9 w-9 rounded-full"
              src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80"
              alt="Image Description"
            />
            <div>
              {/* Card */}
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-900">
                <h2 className="font-medium text-gray-800 dark:text-white">How can we help?</h2>
                <div className="space-y-1.5">
                  <p className="mb-1.5 text-sm text-gray-800 dark:text-white">
                    You can ask questions like:
                  </p>
                  <ul className="list-outside list-disc space-y-1.5 ps-3.5">
                    <li className="text-sm text-gray-800 dark:text-white">What's Preline UI?</li>
                    <li className="text-sm text-gray-800 dark:text-white">
                      How many Starter Pages &amp; Examples are there?
                    </li>
                    <li className="text-sm text-gray-800 dark:text-white">
                      Is there a PRO version?
                    </li>
                  </ul>
                </div>
              </div>
              {/* End Card */}
              <span className="mt-1.5 flex items-center gap-x-1 text-xs text-gray-500">
                <svg
                  className="h-3 w-3 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 7 17l-5-5" />
                  <path d="m22 10-7.5 7.5L13 16" />
                </svg>
                Sent
              </span>
            </div>
          </li>
          {/* End Chat */}
          {/* Chat */}
          <li className="ms-auto flex gap-x-2 sm:gap-x-4">
            <div className="grow space-y-3 text-end">
              <div className="inline-flex flex-col justify-end">
                {/* Card */}
                <div className="inline-block rounded-2xl bg-blue-600 p-4 shadow-sm">
                  <p className="text-sm text-white">whats preline ui?</p>
                </div>
                {/* End Card */}
                <span className="ms-auto mt-1.5 flex items-center gap-x-1 text-xs text-gray-500">
                  <svg
                    className="h-3 w-3 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 7 17l-5-5" />
                    <path d="m22 10-7.5 7.5L13 16" />
                  </svg>
                  Sent
                </span>
              </div>
            </div>
            <span className="inline-flex h-[2.375rem] w-[2.375rem] flex-shrink-0 items-center justify-center rounded-full bg-gray-600">
              <span className="text-sm font-medium leading-none text-white">AZ</span>
            </span>
          </li>
          {/* End Chat */}
          {/* Chat Bubble */}
          <li className="me-11 flex max-w-lg gap-x-2 sm:gap-x-4">
            <img
              className="inline-block h-9 w-9 rounded-full"
              src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80"
              alt="Image Description"
            />
            <div>
              {/* Card */}
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-900">
                <p className="text-sm text-gray-800 dark:text-white">
                  Preline UI is an open-source set of prebuilt UI components based on the
                  utility-first Tailwind CSS framework.
                </p>
                <div className="space-y-1.5">
                  <p className="text-sm text-gray-800 dark:text-white">
                    Herere some links to get started
                  </p>
                  <ul>
                    <li>
                      <a
                        className="text-sm font-medium text-blue-600 decoration-2 hover:underline dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        href="../docs/index.html"
                      >
                        Installation Guide
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-sm font-medium text-blue-600 decoration-2 hover:underline dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        href="../docs/frameworks.html"
                      >
                        Framework Guides
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* End Card */}
              <span className="mt-1.5 flex items-center gap-x-1 text-xs text-red-500">
                <svg
                  className="h-3 w-3 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx={12} cy={12} r={10} />
                  <line x1={12} x2={12} y1={8} y2={12} />
                  <line x1={12} x2="12.01" y1={16} y2={16} />
                </svg>
                Not sent
              </span>
            </div>
          </li>
          {/* End Chat Bubble */}
        </ul>
        {/* End Chat Bubble */}
      </div>
    </Page>
  )
}
