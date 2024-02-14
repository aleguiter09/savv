import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextInput,
  DatePicker,
  NumberInput,
  Card,
} from "@tremor/react";

export default function AddMovementsSkeleton() {
  return (
    <Card className="rounded-md bg-slate-50 p-4">
      <label htmlFor="amount" className="mb-2 block text-sm font-medium">
        Enter a date
      </label>
      <DatePicker
        className="mb-3"
        defaultValue={new Date()}
        enableClear={false}
      />
      <div className="rounded-md mb-4">
        <TabGroup className="mb-3">
          <TabList className="w-full">
            <Tab className="w-full place-content-center">Expenses</Tab>
            <Tab className="w-full place-content-center">Incomes</Tab>
            <Tab className="w-full place-content-center">Transfer</Tab>
          </TabList>
          <TabPanels className="mt-3">
            <TabPanel>
              <div className="mt-2 flex w-full justify-center py-2">
                <output
                  className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
                  aria-label="loading"
                />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
      <label htmlFor="amount" className="mb-2 block text-sm font-medium">
        Enter an amount
      </label>
      <NumberInput
        id="amount"
        name="amount"
        placeholder="Amount..."
        enableStepper={false}
      />
      <label htmlFor="comment" className="mt-2 mb-2 block text-sm font-medium">
        Enter a comment
      </label>
      <TextInput id="comment" name="comment" placeholder="Comment..." />
      <fieldset className="mt-2">
        <legend className="block text-sm font-medium">Choose an option</legend>
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              id="cash"
              name="paid_with"
              type="radio"
              value="cash"
              tabIndex={0}
              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-50"
            />
            <label
              htmlFor="cash"
              className="ml-2 cursor-pointer gap-1.5 rounded-full py-1.5 text-sm"
            >
              Debit/Cash
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="credit"
              name="paid_with"
              type="radio"
              value="credit"
              tabIndex={0}
              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-50"
            />
            <label
              htmlFor="credit"
              className="ml-2 cursor-pointer gap-1.5 rounded-full py-1.5 text-sm "
            >
              Credit
            </label>
          </div>
        </div>
      </fieldset>
      <div className="mt-3 flex flex-row gap-2">
        <button className="w-full rounded-md bg-gray-400 py-2 text-sm font-semibold text-white disabled:opacity-60">
          Close
        </button>
        <button className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-60">
          Confirm
        </button>
      </div>
    </Card>
  );
}
