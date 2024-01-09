import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextInput,
  DatePicker,
} from "@tremor/react";

export default function AddMovementsSkeleton() {
  return (
    <>
      <DatePicker className="mb-3" value={new Date()} />
      <TabGroup className="mb-3">
        <TabList variant="solid" className="mb-2 w-full">
          <Tab className="w-full place-content-center">Expenses</Tab>
          <Tab className="w-full place-content-center">Incomes</Tab>
          <Tab className="w-full place-content-center">Transfer</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="mt-2 flex w-full justify-center py-2">
              <div
                className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
                role="status"
                aria-label="loading"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <TextInput placeholder="Comment..." className="mb-3" />
      <div className="mx-1 flex flex-row gap-2">
        <div className="flex w-full items-center">
          <input
            type="radio"
            value="cash"
            defaultChecked={true}
            className="h-4 w-4 bg-gray-100 text-blue-600  focus:ring-blue-500"
          />
          <label htmlFor="cash" className="ml-2 text-sm font-medium text-black">
            Debit / Cash
          </label>
        </div>
        <div className="flex w-full items-center">
          <input
            type="radio"
            value="credit"
            className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="credit"
            className="ml-2 text-sm font-medium text-black"
          >
            Credit
          </label>
        </div>
      </div>
      <div className="mt-3 flex flex-row gap-2">
        <button className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60">
          Close
        </button>
        <button
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled
        >
          Confirm
        </button>
      </div>
    </>
  );
}
