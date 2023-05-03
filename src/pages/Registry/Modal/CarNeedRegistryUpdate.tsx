

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  styled
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { useFormik } from "formik";
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 } from "uuid";
import * as Yup from "yup";
import { useAppSelector } from '../../../hooks';
import { CarIdregistry, putCarNeedRegistryApi } from '../../../redux/CarReducer/CarReducer';
import { DispatchType, RootState } from '../../../redux/store';
import { storage } from '../../../util/FirebaseConfig';
type Props = {}
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
export const CarNeedRegistryUpdate = (props: any) => {
  const dispatch: DispatchType = useDispatch();
  const { openDad, error, parentCallback,carId,userDad, id,parentCallbackAlert,parentCallbackMessageAlert } = props;
  const { showPopup } = useAppSelector((state: RootState) => state.CarResult);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageRightUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedbackOption, setSelectedbackOption] = useState<string | null>(null);
  const [selectedbackImage, setSelectedbackImage] = useState<File | null>(null);
  const [selectedImagebackUrl, setSelectedImagebackUrl] = useState<string | null>(null);
  // const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files ) {
  //     setSelectedOption("file");
  //     const file3 = event.target.files[0];
  //     setSelectedImage(file3);
  //     const url3 = URL.createObjectURL(file3)
  //     setSelectedImageUrl(url3)
  //     formik.setFieldValue("registryInvoice", url3);
  //   }
  // };
  // const handleFilebackInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setSelectedbackOption("file");
  //     const file = event.target.files[0];
  //     setSelectedbackImage(file);
  //     const url = URL.createObjectURL(file);
  //     setSelectedImagebackUrl(url);
  //     formik.setFieldValue("certificateRegistryDocument", url); // set the URL inside the formik field
  //   }
  // };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
  
      // check if file is a valid image type
      const fileType = file.type;
      if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
        parentCallbackAlert('error');
        parentCallbackMessageAlert('Chỉ nhận ảnh');
        return;
      }
  
      setSelectedOption('file');
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setSelectedImageUrl(url);
      formik.setFieldValue('registryInvoice', url);
    }
  };
 
  const handleFilebackInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const fileType = file.type;
  
      if (fileType !== "image/jpeg" && fileType !== "image/png") {
        parentCallbackAlert("error");
        parentCallbackMessageAlert("Chỉ nhận ảnh");
  
        return;
      }
  
      setSelectedbackOption("file");
      setSelectedbackImage(file);
      const url = URL.createObjectURL(file);
      setSelectedImagebackUrl(url);
      formik.setFieldValue("certificateRegistryDocument", url); // set the URL inside the formik field
    }
  };
  const today = dayjs();
  const [maintenanceDate, setmaintenanceDate] = useState(today);
  const initialValues = {
    id:id,
    carId: carId,
    registrationDeadline: maintenanceDate,
    registryAmount: 0,
    registryInvoice:"",
    registryAddress:"",
    certificateRegistryDocument:""
  };
  const formik = useFormik<CarIdregistry>({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
    registryAmount:Yup.number()
      .typeError(' Sổ tay đăng kiểm phải là số')
      .positive(' Sổ tay đăng kiểm không  để trống')
      // .integer(' Số km bảo dưỡng lần cuối cùng để trống')
      .required(" Sổ tay đăng kiểm không để trống"),
      registryInvoice:Yup.string().required("Hóa đơn bảo trì Không được trống!"),
      registryAddress:Yup.string().required("Địa chỉ đăng kí Không được trống!"),
      certificateRegistryDocument:Yup.string().required("Biên bản đăng kiểm Không được trống!"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const promises = [];

      
        if (selectedImage) {
          const rightImageRef = ref(storage, `images/${selectedImage.name + v4()}`);
          const rightSnapshot = uploadBytes(rightImageRef, selectedImage);
          promises.push(rightSnapshot);
        }else {
          values.registryInvoice = userDad?.registryInvoice; // Set current URL if no new image selected
        }
        if (selectedbackImage) {
          const backImageRef = ref(storage, `noimg/${selectedbackImage.name + v4()}`);
          const backSnapshot = uploadBytes(backImageRef, selectedbackImage);
          promises.push(backSnapshot);
        }else {
          values.certificateRegistryDocument = userDad?.certificateRegistryDocument; // Set current URL if no new image selected
        }
        
        const snapshots = await Promise.all(promises);

        const urls = await Promise.all(
          snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
        );
        if (urls[0]) values.registryInvoice = urls[0];
        if (urls[1])  values.certificateRegistryDocument = urls[1];
        

        const actionAsyncLogin = putCarNeedRegistryApi(values);
        dispatch(actionAsyncLogin)
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
      }
    }
  });
  useEffect(() => {
    if (userDad != null) {
      if (userDad.id !== undefined) {
        formik.setValues(userDad);
      }
    }
    if (userDad === "{}") {
      formik.setValues(initialValues);
    }
   
    if (showPopup == false) {
      formik.setValues(initialValues);
      formik.setTouched({});
    }
  }, [showPopup,openDad]);
  
 
  const handleChange = (newValue: any) => {
    setmaintenanceDate(newValue);
    formik.setFieldValue('registrationDeadline', newValue);
  };
  const handleClose = () => {
    parentCallback(false);
    formik.setValues(initialValues);
    formik.setTouched({});

  };

  const renderuUpdateModalUI = () => {


   
  

    return (
      <>
        <BootstrapDialog
          fullWidth
          maxWidth="sm"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDad}
        >
          <form onSubmit={formik.handleSubmit}>

            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
           Cập nhật thông tin đăng kiểm 
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {error && <div className="text-center text-xl text-red-500 font-semibold mb-2">{error}</div>}
              <div className=" mx-2 gap-2 gap-x-5">
              


                 
                  <div className="w-full mt-2 ">
                    <TextField
                      type="number"
                      size="small"
                      id="outlined-basic16"
                      variant="outlined"
                      label="Số tiền đăng kiểm" 
                      name="registryAmount"
                      defaultValue={userDad?.registryAmount || ""}
                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.registryAmount && formik.errors.registryAmount
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.registryAmount && formik.touched.registryAmount ? (
                      <div className="text-red-600">{formik.errors.registryAmount}</div>
                    ) : null}
                  </div>
        
                  <div className="w-full mt-2  ">
                    <TextField
                     
                      size="small"
                      id="outlined-basic19"
                      label="Địa chỉ đăng kí*"
                      variant="outlined"
                      name="registryAddress"
                      defaultValue={userDad?.registryAddress || ""}
                      fullWidth
                      onChange={formik.handleChange}
                      error={
                        formik.touched.registryAddress && formik.errors.registryAddress
                          ? true
                          : undefined
                      }
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.registryAddress && formik.touched.registryAddress ? (
                      <div className="text-red-600">{formik.errors.registryAddress}</div>
                    ) : null}
                  </div>


                  <div className="mt-2 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            label="Hạn cuối đăng kiểm*"
                            value={userDad?.registrationDeadline}
                            inputFormat="DD/MM/YYYY "
                            onChange={(newValue) =>
                              handleChange(newValue == null ? today : newValue)
                            }
                           disabled
                            minDate={today}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                error={formik.errors.registrationDeadline ? true : undefined}
                                {...params}
                              />
                            )}
                          />
                        </Stack>
                      
                      </LocalizationProvider>
                    </div>

              <div className='grid grid-cols-2'>
              <div className="w-full mt-2 ">
                 
                 <div className="image-option1">
                   <Button
                     variant="contained"
                     component="label"
                     className="bg-white text-[#1976d2] shadow-none rounded-md"

                   >
                     <AddPhotoAlternateIcon />Hóa đơn bảo trì*
                     <input type="file" hidden id="image1" onChange={handleFileInputChange} />
                   </Button>

                 </div>
                 {formik.touched.registryInvoice && formik.errors.registryInvoice && (
                   <div className="text-red-600">{formik.errors.registryInvoice}</div>
                 )}
               {selectedImage == undefined ? (
                 <img
                   alt=""
                   className=" h-24 w-24 my-5"
                   src={userDad?.registryInvoice}
                 />
               ) : (
                 selectedImage && (
                   <img
                     alt=""
                     className=" h-24 w-24 my-5"
                     src={
                       selectedImageRightUrl ? window.URL.createObjectURL(selectedImage) : ''
                     }
                   />
                 )
                 )}


             </div>
             <div className="w-full mt-2 ">
            
             <div className="item_box_image">
                 <div className="image-option">
                   <Button
                     variant="contained"
                     component="label"
                     className="bg-white text-[#1976d2] shadow-none rounded-md"
                   >
                     <AddPhotoAlternateIcon />Biên bản đăng kiểm*
                     <input type="file" hidden onChange={handleFilebackInputChange} />

                   </Button>

                 </div>
                 {formik.touched.certificateRegistryDocument && formik.errors.certificateRegistryDocument && (
                   <div className="text-red-600">{formik.errors.certificateRegistryDocument}</div>
                 )}
                 {selectedbackImage == undefined ? (
                 <img
                   alt=""
                   className=" h-24 w-24 my-5"
                   src={userDad?.certificateRegistryDocument}
                 />
               ) : (
                   selectedbackImage && (
                   <img
                     alt=""
                     className=" h-24 w-24 my-5"
                     src={
                       selectedImagebackUrl ? window.URL.createObjectURL(selectedbackImage) : ''
                     }
                   />
                 )
              
                 )}


             </div>
            </div>
              </div>
                
               
              </div>
            </DialogContent>
            <DialogActions>
              <Button type="submit" >
                Thêm mới
              </Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
      </>
    );
  };

  return <>{renderuUpdateModalUI()}</>;
};
