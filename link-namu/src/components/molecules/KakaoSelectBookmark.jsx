import { useState, useEffect } from "react";
import BookmarkSelectItem from "../atoms/BookmarkSelectItem";
import Checkbox from "../atoms/Checkbox";
import { createBookmark } from "../../apis/bookmark";

import ModalBox from "../atoms/ModalBox";
import { printToast } from "../../utils/toast";
import { Scrollbars } from "react-custom-scrollbars-2";
import ModalTitle from "../atoms/ModalTitle";
import ModalSubtitle from "../atoms/ModalSubtitle";
import Loader from "../atoms/Loader";
import { useCloseModal } from "../../hooks/useCloseModal";
import WorkspaceSeleceBox from "../atoms/WorkspaceSelectBox";
import CategorySelectBox from "../atoms/CategorySelectBox";

const KakaoSelectBookmark = ({ data, getLinkList }) => {
  const closeModal = useCloseModal();
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedIdList, setCheckedIdList] = useState([]);
  const [bookmarkList, setBookmarkList] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [errorOccured, setErrorOccured] = useState(false);
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");

  useEffect(() => {
    setBookmarkList(getLinkList());
  }, [data]);
  useEffect(() => {
    console.log("bookmarkList", bookmarkList);
  }, [bookmarkList]);

  const changeData = (index, updatedData) => {
    setBookmarkList((prev) => {
      const updatedBookmarkList = [...prev];
      updatedBookmarkList[index] = updatedData;
      return updatedBookmarkList;
    });
  };

  const handleSelectAllClick = () => {
    if (selectAllCheckbox && selectAllCheckbox.checked) {
      const arr = [];
      for (let i = 0; i < bookmarkList?.length; i++) {
        arr.push(i);
      }
      setCheckedIdList(arr);
    } else {
      setCheckedIdList([]);
    }
  };
  const handleSelectAllChange = (e) => {
    setIsAllChecked(e.target.checked);
  };
  const handleCheckedChange = (checked, id) => {
    if (checked) {
      setCheckedIdList([...checkedIdList, id]);
    } else {
      setCheckedIdList(checkedIdList.filter((el) => el !== id));
    }
  };

  useEffect(() => {
    if (bookmarkList?.length > 0)
      setIsAllChecked(checkedIdList.length === bookmarkList?.length);
  }, [checkedIdList]);

  const addBookmarkList = () => {
    if (!categoryId) {
      printToast("카테고리를 선택해주세요.", "error");
      return;
    }

    if (bookmarkList.length === 0) {
      closeModal();
      return;
    }
    const selectedBookmarkList = [];

    try {
      checkedIdList.forEach((id) => {
        if (bookmarkList[id].bookmarkName.length === 0) {
          // focus??
          throw new Error("북마크 제목은 공백일 수 없습니다.");
        }
        selectedBookmarkList.push(bookmarkList[id]);
      });
    } catch (err) {
      printToast(err.message, "error");
    }

    console.log("요청할 데이터 : ", selectedBookmarkList);
    if (selectedBookmarkList.length === 0) {
      printToast("추가할 북마크를 선택해주세요.", "error");
      return;
    }

    setErrorOccured(false);

    selectedBookmarkList.forEach((data, index) => {
      createBookmark({
        bookmarkName: data.bookmarkName,
        bookmarkLink: data.link,
        categoryId: categoryId,
      })
        .then((res) => {
          console.log(res);
          if (res.status !== 200) {
            setErrorOccured(true);
            throw new Error(res.data?.error?.message);
          }

          console.log(index + "번째 항목이 추가되었습니다.");
        })
        .catch((err) => {
          setErrorOccured(true);
          const msg = err.message;
          console.log(msg);
          // printToast(msg, "error");
          return;
        });
    });

    console.log("에러발생", errorOccured);

    if (!errorOccured) {
      printToast("추가되었습니다.", "success");
      // closeModal();
    }
  };

  return {
    content: (
      <div>
        <div className="mx-auto mt-5 text-center">
          <ModalTitle>발견된 링크</ModalTitle>
          <ModalSubtitle>추가할 링크를 선택해주세요.</ModalSubtitle>
        </div>
        <ModalBox>
          <div className="h-[450px] flex items-center justify-center">
            {!bookmarkList ? (
              <Loader />
            ) : bookmarkList.length === 0 ? (
              <div>발견된 링크가 없습니다.</div>
            ) : (
              <div className="px-5 flex flex-col">
                <div>
                  <div className="float-right flex gap-x-3 pr-10">
                    <span>전체 선택</span>
                    <Checkbox
                      id="selectAllCheckbox"
                      checked={isAllChecked}
                      onChange={handleSelectAllChange}
                      onClick={handleSelectAllClick}
                    />
                  </div>
                  <ul className="h-[400px] w-[800px] mx-auto p-2">
                    <Scrollbars>
                      {bookmarkList.map((item, index) => {
                        return (
                          <li key={index}>
                            <BookmarkSelectItem
                              id={index}
                              checked={checkedIdList.includes(index)}
                              handleCheckedChange={(e) => {
                                handleCheckedChange(e.target.checked, index);
                              }}
                              title={item?.title}
                              url={item?.link}
                              imageUrl={item?.imageUrl}
                              changeHandler={(data) => {
                                changeData(index, data);
                              }}
                            />
                          </li>
                        );
                      })}
                    </Scrollbars>
                  </ul>
                </div>
                <div>
                  <ModalSubtitle>추가할 카테고리</ModalSubtitle>
                  <div className="flex gap-x-2">
                    <WorkspaceSeleceBox
                      value={workspaceId}
                      changeHandler={setWorkspaceId}
                      isSlimType={true}
                    />
                    <CategorySelectBox
                      workspaceId={workspaceId}
                      value={categoryId}
                      changeHandler={setCategoryId}
                      isSlimType={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModalBox>
      </div>
    ),
    title: bookmarkList && bookmarkList.length !== 0 ? "추가" : "확인",
    buttonHandler: addBookmarkList,
  };
};

export default KakaoSelectBookmark;
