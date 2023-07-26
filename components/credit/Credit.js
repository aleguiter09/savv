import { Heading, Flex } from "@chakra-ui/react";
import { CardComponent, CardButtonComponent } from "../commons/CardComponent";

const months = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const expenses = {
  amount: 20000,
  dues: 6,
  month: 3,
  year: 23,
};

const due = {
  amount: 2000,
  month: 3,
};

const Credit = () => {
  return (
    <>
      <Heading size="lg" ms="2" py="4">
        Next month: $50000
      </Heading>
      <Flex my="4" overflowX="auto">
        <CardComponent title="Title" amount={200} />
      </Flex>
    </>
  );
};

export default Credit;
