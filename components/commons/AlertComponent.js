import { deleteAccount } from "../../api/database";
import {
  Button,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { useFinancesContext } from "../../context/FinancesContext";

export const AlertComponent = ({ id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { updateAccounts } = useFinancesContext();
  const cancelRef = useRef();

  const handleDelete = async () => {
    await deleteAccount(id);
    updateAccounts();
    onClose();
  };

  return (
    <>
      <DeleteIcon
        fontSize="xs"
        mt="2"
        me="2"
        cursor="pointer"
        onClick={onOpen}
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent w="90%">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button fontSize="sm" p="3" ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                fontSize="sm"
                p="3"
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
