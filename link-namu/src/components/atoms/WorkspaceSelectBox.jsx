import { useSelector } from "react-redux/es/hooks/useSelector";
import { useState } from "react";
import { getWorkspaceList } from "../../store/slices/workspaceSlice";

const WorkspaceSeleceBox = ({
  changeHandler = () => {},
  value = null,
  isSlimType = false,
  disabled = false,
}) => {
  const workspaceList = useSelector(getWorkspaceList);
  const [selectedId, setSelectedId] = useState(value);

  const handleChange = (e) => {
    if (e.target.value) {
      changeHandler(Number(e.target.value));
      setSelectedId(e.target.value);
    }
  };

  return (
    <select
      onChange={handleChange}
      value={selectedId}
      disabled={`${disabled ? "disabled" : ""}`}
      className={`w-full ${
        isSlimType ? "p-1" : "p-3"
      } rounded-lg bg-white border border-[#56678942]`}
    >
      <option key={0} value="" selected disabled>
        == 워크스페이스 선택 ==
      </option>
      {workspaceList &&
        workspaceList.map((workspace) => {
          return (
            <option key={workspace.workspaceId} value={workspace.workspaceId}>
              {workspace.workspaceName}
            </option>
          );
        })}
    </select>
  );
};

export default WorkspaceSeleceBox;
