import Icon from "@/components/common/Icon";
import AddMovementsSkeleton from "@/components/movements/AddMovement/AddMovementSkeleton";

export default function loading() {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Icon color="stone" icon={"arrow-left"} />
        <h4 className="font-medium">Add Movement</h4>
        <span></span>
      </div>
      <AddMovementsSkeleton />
    </>
  );
}
