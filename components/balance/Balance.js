import { Flex, Text } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { CardComponent } from "../commons/CardComponent";
import { CardButtonComponent } from "../commons/CardButtonComponent";
import { DrawerAddFinance } from "./DrawerAddFinance";
import { ExpensesChart } from "../commons/ExpensesChart/ExpensesChart";
import { useFinancesContext } from "../../context/FinancesContext";

const Balance = () => {
  const { accounts, categories, total, totalExpenses } = useFinancesContext();

  const expensesDefault = [
    {
      account: "Santander",
      category: "Food",
      amount: 1500,
      date: new Date(),
      comment: "PeYa - Charlies",
    },
    {
      account: "Mercado Pago",
      category: "Food",
      amount: 3000,
      date: new Date(),
      comment: "PeYa - Easy Salad",
    },
    {
      account: "Santander",
      category: "House",
      amount: 4500,
      date: new Date(),
      comment: "Kilbel - Varios",
    },
  ];

  return (
    <>
      <Flex justifyContent="space-between" mx="5">
        <Text mt="2" fontSize="lg">
          Balance: ${total.toFixed(1)}
        </Text>
        <Flex bg="gray.600" rounded="25" p="2" cursor="pointer">
          <Text fontSize="sm" ps="1">
            Details
          </Text>
          <ChevronRightIcon ms="1" pt="1" fontSize="lg" />
        </Flex>
      </Flex>
      <Flex my="4" overflowX="auto">
        {accounts.map((acc) => (
          <CardComponent
            id={acc.id}
            key={acc.id}
            title={acc.title}
            amount={acc.amount}
          />
        ))}
        <CardButtonComponent />
      </Flex>
      <Flex direction="column" align="center">
        <ExpensesChart categories={categories} total={totalExpenses} />
        <Flex mt="3">
          <DrawerAddFinance type={"income"} accounts={accounts} />
          <DrawerAddFinance
            type={"expense"}
            accounts={accounts}
            categories={categories}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default Balance;
