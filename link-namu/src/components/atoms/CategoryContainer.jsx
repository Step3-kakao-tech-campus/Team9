import AddCategoryItem from "./AddCategoryItem";
import CategoryItem from "./CategoryItem";

/**
 * 워크스페이스 아이템의 하위 카테고리들을 감싸는 컴포넌트
 * @param {number} workspaceId - 워크스페이스 ID
 * @param {array} categories - 카테고리 리스트
 * @returns
 */
const CategoryContainer = ({ workspaceId, workspaceName, categories }) => {
  return (
    <div className="ml-3">
      <div className="border-l-2 border-[#d9d9d9]">
        {categories.map((category, index) => {
          return (
            <CategoryItem
              key={index}
              workspaceId={workspaceId}
              workspaceName={workspaceName}
              categoryId={category.categoryId}
              categoryName={category.categoryName}
            />
          );
        })}
      </div>
      <AddCategoryItem workspaceId={workspaceId} />
    </div>
  );
};

export default CategoryContainer;
