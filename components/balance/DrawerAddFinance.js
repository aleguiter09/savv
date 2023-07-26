import {
  updateAccount,
  insertExpense,
  insertIncome,
  updateCategory,
} from "../../api/database";
import {
  Button,
  Input,
  Select,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { useFinancesContext } from "../../context/FinancesContext";

export const DrawerAddFinance = ({ type, accounts, categories }) => {
  const { updateAccounts, updateCategories } = useFinancesContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const accountRef = useRef();
  const amountRef = useRef();
  const categoryRef = useRef();
  const commentRef = useRef();

  const handleAddExpense = async () => {
    const account = parseInt(accountRef.current.value);
    const amount = parseFloat(amountRef.current.value);
    const category = parseInt(categoryRef.current.value);
    const comment = commentRef.current.value;

    if (account && amount > 0) {
      const newExpense = {
        account: account,
        amount: amount,
        comment: comment,
        category: category,
      };

      const acc = accounts.find((acc) => acc.id === newExpense.account);
      acc.amount -= newExpense.amount;
      await updateAccount(acc.id, acc);

      const cat = categories.find((cat) => cat.id === newExpense.category);
      cat.amount += newExpense.amount;
      await updateCategory(cat.id, cat);

      await insertExpense(newExpense);

      updateAccounts();
      updateCategories();
    }
    onClose();
  };

  const handleAddIncome = async (newIncome) => {
    const account = parseInt(accountRef.current.value);
    const amount = parseFloat(amountRef.current.value);
    const comment = commentRef.current.value;

    if (account && amount > 0) {
      const newIncome = {
        account: account,
        amount: amount,
        comment: comment,
      };

      const acc = accounts.find((acc) => acc.id === newIncome.account);
      acc.amount += newIncome.amount;
      await updateAccount(acc.id, acc);
      await insertIncome(newIncome);

      updateAccounts();
    }
    onClose();
  };

  return (
    <>
      {type === "expense" ? (
        <Button colorScheme="red" mb="3" onClick={onOpen}>
          <MinusIcon me="3" />
          <Text fontSize="sm">Add Expense</Text>
        </Button>
      ) : (
        <Button colorScheme="blue" mb="3" me="3" onClick={onOpen}>
          <AddIcon me="3" />
          <Text fontSize="sm">Add Income</Text>
        </Button>
      )}

      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay backdropFilter="blur(5px)" />
        <DrawerContent>
          <DrawerHeader>Add {type}</DrawerHeader>
          <DrawerBody>
            <label>
              <Text fontWeight="bold">Account</Text>
              <Select ref={accountRef} mt="1" mb="2">
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.title}
                  </option>
                ))}
              </Select>
            </label>
            {categories && (
              <label>
                <Text fontWeight="bold">Category</Text>
                <Select ref={categoryRef} mt="1" mb="2">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </Select>
              </label>
            )}
            <Text fontWeight="bold">Amount</Text>
            <Input
              mt="1"
              placeholder="0.00"
              type="number"
              rounded="3"
              ref={amountRef}
              mb="2"
            />
            <Text fontWeight="bold">Comment</Text>
            <Textarea
              mt="1"
              placeholder="Comment"
              rounded="3"
              ref={commentRef}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button
              fontSize="sm"
              p="3"
              colorScheme="blue"
              mr="3"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              fontSize="sm"
              p="3"
              onClick={type === "expense" ? handleAddExpense : handleAddIncome}
            >
              Confirm
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
