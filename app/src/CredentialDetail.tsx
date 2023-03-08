import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CredentialDetail() {
  const navigate = useNavigate();

  useEffect(() => {
    const first = localStorage.getItem("name")
    if (first === null) {
      navigate("/credential/creation")
    }

  }, [navigate])

  return (
    <div className="flex justify-center items-center m-1 mt-5">
      <div className="border-gray-500 border-2 rounded-lg p-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-6 text-center">株式会社123</h2>
        <img
          src="./company.png"
          alt="company"
          className="w-1/2 h-auto mb-6 mx-auto"
        />
        <div className="flex flex-col items-center mb-6">
          <label className="font-bold mb-2">氏名</label>
          <span>{localStorage.getItem("name")}</span>
        </div>
        <div className="flex justify-center items-center mb-4 min-w-full">
          <div className="flex flex-col items-center m-5">
            <label className="font-bold mb-2 text-center w-20">社員番号</label>
            <span>12</span>
          </div>
          <div className="flex flex-col items-center m-5">
            <label className="font-bold mb-2 text-center w-20">アドレス</label>
            <span>12</span>
          </div>
        </div>
        <div className="flex justify-center mb-4 min-w-full">
          <div className="flex flex-col items-center m-5">
            <label className="font-bold mb-2 text-center w-20">部署</label>
            <span>{localStorage.getItem("department")}</span>
          </div>
          <div className="flex flex-col items-center m-5">
            <label className="font-bold mb-2 text-center w-20">役職</label>
            <span>{localStorage.getItem("skill")}</span>
          </div>
        </div>

        <div className="flex justify-center mb-4 min-w-full">
          <div className="flex flex-col items-center m-5">
            <label className="font-bold mb-2 text-center w-20">入社日</label>
            <span>2023年1月1日</span>
          </div>
          <div className="flex flex-col items-center m-5">
            <label className="font-bold mb-2 text-center w-20">有効期限</label>
            <span>2025年1月1日</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CredentialDetail;