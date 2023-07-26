import {
  Button,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Card,
  CardBody,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { insertAccount } from "../../api/database";
import { useFinancesContext } from "../../context/FinancesContext";

export const CardButtonComponent = ({}) => {
  const { updateAccounts } = useFinancesContext();
  const titleRef = useRef();
  const amountRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirm = async () => {
    const title = titleRef.current.value;
    const amount = parseFloat(
      amountRef.current.value ? amountRef.current.value : 0
    );
    if (title) {
      await insertAccount({
        title,
        amount,
      });
      updateAccounts();
    }
    onClose();
  };

  return (
    <>
      <Card minWidth="120" mx="2">
        <CardBody align="center" mt="1">
          <Button onClick={onOpen} rounded="25">
            <AddIcon />
          </Button>
        </CardBody>
      </Card>
      <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(5px)" />
        <DrawerContent>
          <DrawerHeader>Add Account</DrawerHeader>
          <DrawerBody>
            <Input placeholder="Title" mb="3" rounded="3" ref={titleRef} />
            <Input
              placeholder="Amount"
              type="number"
              rounded="3"
              ref={amountRef}
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
            <Button fontSize="sm" p="3" onClick={handleConfirm}>
              Confirm
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
