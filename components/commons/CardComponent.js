import {
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { AlertComponent } from "./AlertComponent";

export const CardComponent = ({ id = null, title, amount }) => {
  return (
    <>
      <Card minWidth="150" mx="2" color={amount >= 0 ? "white" : "red.500"}>
        <Flex justifyContent="end">
          <AlertComponent id={id} />
          <EditIcon
            fontSize="sm"
            mt="2"
            me="2"
            cursor="pointer"
            // onClick={onOpen}
          />
        </Flex>
        <CardBody pt="0">
          <Stat>
            <StatLabel>{title}</StatLabel>
            <StatNumber fontSize="xl">$ {amount.toFixed(1)}</StatNumber>
          </Stat>
        </CardBody>
      </Card>
    </>
  );
};
