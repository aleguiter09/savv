import { Flex, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { AddCategoryButton } from "./AddCategoryButton";
import { ExpenseBar } from "./ExpensesBar";

export const ExpensesChart = ({ categories, total }) => {
  const [currentYear, setCurrentYear] = useState(2023);
  const [currentMonth, setCurrentMonth] = useState(0);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const onLeftClick = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const onRightClick = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <Flex
      direction="column"
      w="100%"
      maxW="350px"
      background="gray.700"
      p="4"
      rounded="15"
    >
      <Flex justify="space-around" mb="3">
        <ChevronLeftIcon fontSize="2xl" onClick={onLeftClick} />
        <Text fontSize="md">
          {months[currentMonth] + " " + currentYear.toString()}
        </Text>
        <ChevronRightIcon fontSize="2xl" onClick={onRightClick} />
      </Flex>
      {categories.map((c) => (
        <ExpenseBar id={c.id} key={c.id} category={c} total={total} />
      ))}
      <Flex justify="center">
        <AddCategoryButton />
      </Flex>
      <Flex justifyContent="space-between">
        <Text size="sm" mt="2">
          Expenses: ${total.toFixed(1)}
        </Text>
        <Flex bg="gray.600" rounded="25" p="2" cursor="pointer">
          <Text fontSize="xs" ps="1">
            Details
          </Text>
          <ChevronRightIcon ms="1" pt="1" />
        </Flex>
      </Flex>
    </Flex>
  );
};
