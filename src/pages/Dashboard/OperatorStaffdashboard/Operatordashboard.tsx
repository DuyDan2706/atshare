import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Card } from "@mui/material";
import { useEffect } from 'react';
import { Link } from "react-router-dom";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import TimeToLeaveOutlinedIcon from "@mui/icons-material/TimeToLeaveOutlined";
import { useState } from "react";

import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import { useDispatch, useSelector } from 'react-redux';
import { getCarNeedRegistryApi, getcarAsyncApi, getcaractiveAsyncApi, getneedmaintainceApi } from '../../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../../redux/store';
import { useAppSelector } from "../../../hooks";
import { getParkingLotcarAsyncApi } from "../../../redux/ParkingLotReducer/ParkingLotReducer";
import { getCustomerinfoReducerAsyncApi } from "../../../redux/CustomerinfoReducer/CustomerinfoReducer";
import { getUsertAsyncApi } from "../../../redux/UserReducer/userReducer";
import { getCarContractgroupReducercarAsyncApi } from "../../../redux/ContractgroupReducer/ContractgroupReducer";
import DonutChartComponent from "../Admindashboard/DonutChartComponent";

type Props = {}

export default function Operatordashboard({}: Props) {
  const { CarActiveResult} = useSelector((state: RootState) => state.CarResult);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 1 });
  const [statusContractGr, setStatusContractGr] = useState(0);
  let filter = {
    pagination: pagination,
    status: statusContractGr === 0 ? "" : statusContractGr,
    id: null,
    CitizenIdentificationInfoNumber:null
  };
  let filterUser = {
    pagination: pagination,
    searchName: "",
    searchEmail: "",
    searchPhoneNumber: "",
  };

  const [filterCar, setFilterCar] = useState({
    carStatusId: 0,
    carMakeName: "",
    seatNumber: 0,
    carColor: "",
    CarModelId: 0,
  });
  const userString = localStorage.getItem("user");
  const userProfile = userString ? JSON.parse(userString) : null;
  const parkingLotId = userProfile?.parkingLotId;
  const { contractgroup } = useAppSelector(
    (state: RootState) => state.ContractGroup
  );
  const { userList } = useAppSelector((state: RootState) => state.user);
  const { carmaitance } = useAppSelector((state: RootState) => state.CarResult);
  const { CarNeedRegistry } = useSelector(
    (state: RootState) => state.CarResult
  );
  const { customerinfo } = useAppSelector(
    (state: RootState) => state.customerinfo
  );
  const { ParkingLot } = useSelector((state: RootState) => state.ParkingLot);
  const getAllparkinglotdetail = () => {
    const actionAsync = getParkingLotcarAsyncApi();
    dispatch(actionAsync);
  };
  const getcustomerinfoApi = () => {
    const actionAsync = getCustomerinfoReducerAsyncApi();
    dispatch(actionAsync);
  };
  const getUserAPi = () => {
    const actionAsync = getUsertAsyncApi(filterUser);
    dispatch(actionAsync);
  };
  const getAllCarNeedRegistryApi = () => {
    const actionAsync = getCarNeedRegistryApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      parkingLotId:null
    });
    dispatch(actionAsync);
  };
  const getAllcar = () => {
    const actionAsync = getcarAsyncApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filterCar,
    });
    dispatch(actionAsync);
  };
 
  const getAllcarmaitance = () => {
    const actionAsync = getneedmaintainceApi({
      page: pagination.page,
        pageSize: pagination.pageSize,
        parkingLotId: parkingLotId
    });
    dispatch(actionAsync);
  };
  // const contracGroupFinish =
  //   contractgroup.total != 0
  //     ? contractgroup.contracts.filter((item, index) => {
  //         if (item.contractGroupStatusId == 17) {
  //           return item;
  //         }
  //       })
  //     : undefined;
  const getContractAPi = () => {
    const actionAsync = getCarContractgroupReducercarAsyncApi(filter);
    dispatch(actionAsync);
  };

  useEffect(() => {
    getAllparkinglotdetail();
    getcustomerinfoApi();
    getUserAPi();
    getContractAPi();
    getAllcarmaitance();
    getAllCarNeedRegistryApi();
    getAllcar();
    getAllcarActive();
    return () => {};
  }, []);
  // const { customerinfo } = useAppSelector((state: RootState) => state.customerinfo);
  const dispatch: DispatchType = useDispatch();
  
  const getAllcarActive = () => {
    const actionAsync = getcaractiveAsyncApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
       parkingLotId
    }
    )
    dispatch(actionAsync);
  }
  useEffect(() => {
    getAllcarActive()
  

  }, []);
  
  const filterCarActive = CarActiveResult.cars.filter((item, index) => {
    if (item.carStatus == "Sẵn sàng để thuê") {
      return item;
    }
  });
  const data = [
    CarActiveResult.total - filterCarActive.length,
    filterCarActive.length,
  ];
  const labels = ["Xe đang hoạt động", "Xe chờ kiểm duyệt"];
  return (
    <section className="bg-gray-100">
      <div className="mt-5 mx-8 ">
        {/* <h2 className=" text-2xl  mt-2 font-mono font-bold mb-5 ">Tổng quan</h2> */}

        <div className=" mb-2 gap-2 mt-2 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400 pl-2">
          Danh sách quản lý
        </div>
        <div className="grid grid-cols-3 gap-10 mt-4">
          <Card className="flex  ">
            <div className="">
              <Link to="/Admin/ContractGroup">
                <button className="text-white bg-gray-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <ShoppingBagOutlinedIcon className="text-teal-400 h-12 w-12" />
                </button>
              </Link>
            </div>
            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-teal-400">{contractgroup.total}</div>
                <div className="text-sm mt-3 text-gray-500">Đơn</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đang trên hệ thống</div>
              </div>
            </div>
          </Card>
          {/* <Card className="flex   ">
            <div className="">
              <Link to="/Scheduling">
                <button className="text-white bg-yellow-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <SupervisorAccountOutlinedIcon className="text-yellow-400 h-12 w-12" />
                </button>
              </Link>
            </div>

            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-yellow-400">
                  50
                </div>
                <div className="text-sm mt-3 text-gray-500">Khách hàng</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đã thuê xe</div>
              </div>
            </div>
          </Card> */}

          <Card className="flex  ">
            <div className="">
              <Link to="/Operator/CarActiveManagement">
                <button className="text-white bg-green-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <PersonOutlineOutlinedIcon className="text-green-700 h-12 w-12" />
                </button>
              </Link>
            </div>
            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-green-700">
           {CarActiveResult.total}
                </div>
                <div className="text-sm mt-3 text-gray-500">Số xe trong bãi</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đang hoạt động</div>
              </div>
            </div>
          </Card>
          <Card className="flex  ">
            <div className="">
              <Link to="/Scheduling">
                <button className="text-white bg-blue-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <LocalParkingIcon className="text-blue-500 h-12 w-12" />
                </button>
              </Link>
            </div>
            <div className="grid grid-rows-2 mt-2 ml-2">
              <div className="flex gap-1 ">
                <div className="text-3xl font-extrabold  text-blue-500">1</div>
                <div className="text-sm mt-3 text-gray-500">Bãi đậu xe đang quản lí</div>
              </div>
              <div className=" font-bold flex gap-1  text-gray-500  ">
                <CheckCircleOutlineIcon className="" />
                <div className="text-sm mt-[1px]">Đang hoạt động</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 2xl:grid-cols-5  gap-y-4 2xl:gap-x-4 gap-x-0   mt-4">
          <Card className="col-span-3 ">
            <div className=" gap-2 mt-5  font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Chi tiết xe</p>
            </div>
            <div className="grid gap-10 grid-cols-1 lg:grid-cols-2 mx-10 my-5">
              <Card className=" bg-blue-50 flex gap-5">
              <Link to="/Operator/CarActiveManagement">
                <button className="text-white bg-blue-500 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <TimeToLeaveOutlinedIcon className="text-white h-12 w-12" />
                </button>
                </Link>
                <div className="mt-5 ">
                  <p className="text-gray-400 font-light"> xe đang hoạt động</p>
                  <p className="text-blue-500 text-lg mt-2 font-bold">{CarActiveResult.total}</p>
                </div>
              </Card>
              <Card className=" bg-yellow-50 flex gap-5">
              <Link to="/Operator/CarMaintenanceInfo">
                <button className="text-white bg-yellow-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <EngineeringOutlinedIcon className="text-white h-12 w-12" />
                </button>
                </Link>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe tới hạn bảo dưỡng</p>
                  <p className="text-yellow-400 text-lg mt-2 font-bold">  {carmaitance.total}</p>
                </div>
              </Card>
              <Card className=" bg-indigo-100 flex gap-5">
              <Link to="/Operator/CarNeedRegistry">
                <button className="text-white bg-indigo-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <NoCrashOutlinedIcon className="text-white h-12 w-12" />
                </button>
                </Link>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe tới hạn đăng kiểm</p>
                  <p className="text-indigo-400 text-lg mt-2 font-bold">{CarNeedRegistry.total}</p>
                </div>
              </Card>
            </div>
          </Card>
          <Card className="col-span-2 w-full">
            <div className=" gap-2 mt-5 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Xe</p>
            </div>
            <Card className="mt-2 bg-yellow-50 flex gap-5">
                <button className="text-white bg-yellow-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <EngineeringOutlinedIcon className="text-white h-12 w-12" />
                </button>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe đã bảo dưỡng trong tháng</p>
                  <p className="text-yellow-400 text-lg mt-2 font-bold">2</p>
                </div>
              </Card>
              <Card className="mt-12 bg-indigo-100 flex gap-5">
                <button className="text-white bg-indigo-400 rounded-lg  ml-5 my-[10px] h-20 w-20">
                  <NoCrashOutlinedIcon className="text-white h-12 w-12" />
                </button>
                <div className="mt-5 ">
                  <p className="text-gray-400">Xe đã đăng kiểm trong tháng</p>
                  <p className="text-indigo-400 text-lg mt-2 font-bold">3</p>
                </div>
              </Card>
          </Card>
          <Card className="col-span-2 w-full">
            <div className=" gap-2 mt-5 flex font-sans font-bold uppercase ml-2 text-lg border-l-4 border-blue-400">
              <p className="ml-2">Xe</p>
            </div>
            <DonutChartComponent data={data} labels={labels} />
          </Card>
        </div>
       
      </div>
    </section>
  )
}