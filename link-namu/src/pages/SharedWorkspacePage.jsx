import { useEffect, useState } from "react";
import { getWorkspaceFromEncodedId } from "../apis/share";
import SharedCategoryCard from "../components/atoms/SharedCategoryCard";
import { useNavigate } from "react-router-dom";

const SharedWorkspacePage = () => {
  const navigate = useNavigate();
  const [encodedId, setEncodedId] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const query = currentUrl?.split("?")[1];
    setEncodedId(query.replace(`workspace=`, ""));
  }, []);

  useEffect(() => {
    if (!encodedId) return;

    getWorkspaceFromEncodedId({ encodedWorkspaceId: encodedId })
      .then((res) => {
        console.log("res", res);

        if (res.status === 404) {
          navigate("/notfound");
        } else if (res.status === 403) {
          navigate("/forbidden");
        }
        if (res.status !== 200) {
          // TODO: 에러 처리
        }
        const data = res?.data?.response;
        setWorkspaceName(data.workSpaceName);
        setCategoryList(data.sharedCategoryList);
      })
      .catch((err) => {});
  }, [encodedId]);

  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto pt-20">
        <span className="text-xl font-semibold">{workspaceName}</span>
      </div>
      <div>
        <div
          className={`mx-auto grid grid-cols-5 gap-x-5 gap-y-5 m-10 p-5 border rounded`}
        >
          {categoryList.map((category) => {
            const url = `/share-link/category/share?category=${category.shareCategoryLink}`;
            return (
              <SharedCategoryCard
                categoryName={category.categoryName}
                url={url}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SharedWorkspacePage;
