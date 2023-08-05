import { Actionsheet, Box, Card, Icon, Text, useDisclose } from 'native-base'
import { setTextMatrix } from 'pdf-lib'
import React,{ useEffect, useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'

import { CustomBtn, NavBtn } from '../../components/CustomFormComponents/CustomBtn'
import DropdownComponent from '../../components/CustomFormComponents/Dropdown'
import MultiSelectComponent from '../../components/CustomFormComponents/MutiSelectDropdown'
import Form from '../../components/Forms/form'
import CustomLoader from '../../components/loaders/CustomLoader'
import MainScreenLayout from '../../layouts/mainScreenLayout'
import usersData from '../../redux/reducers/usersData'
import { setCustomLoader } from '../../redux/reducers/userState'
import SeekHubTabList from '../../sections/SeekHub/seekHubTabList'
import { requestResource, validationSchema } from '../../utilis/validation'
import SeekHubActions from './SeekHubAction'

type Props = {}

const SeekHubScreen = (props: Props) => {
    const {uid, photoURL}: any = useSelector((state: any)=> state.bootReducer.userInfo);
    const userFirestoreData = useSelector((state: any) => { return state.usersData });
    const theme = useSelector((state: any) => state.theme);
    const {isOpen, onClose, onOpen, onToggle} = useDisclose();
    const list: any = useSelector((state: any) => state.subjectsList.list || []);
    const [subjectListDetail, setSubjectListDetail] = useState<any[]>(list);
    const [branchData, setBranchData] = useState<any>([]);
    const [selectedBranch, setSelectedBranch] = useState(null)
    const [semList, setSemList] = useState<any>([]);
    const dispatch: any = useDispatch()
    const formRef : any = useRef();
    const apiResponse = useSelector((state: any) => state?.bootReducer?.utilis?.courses);

    const data =  [
    { label: 'Notes', value: 'Notes' },
    { label: 'Syllabus', value: 'Syllabus' },
    { label: 'Question Papers', value: 'QuestionPapers' },
    { label: 'Other Resources', value: 'OtherResources' },
    ]

    const filter = {
      sem: userFirestoreData?.usersData?.sem,
      branch: userFirestoreData?.usersData?.branch,
    }

    useEffect(() => {
      dispatch(SeekHubActions.getNewRequests(uid, userFirestoreData.usersData, filter))
    },[])

    function getOrdinalSuffix(text: string) {
      const number = parseInt(text, 10);
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const lastDigit = number % 10;
      const suffix = suffixes[(lastDigit === 1 && number !== 11) ? 1
        : (lastDigit === 2 && number !== 12) ? 2
          : (lastDigit === 3 && number !== 13) ? 3
            : 0];
      return `${number}${suffix}`;
    }

    useEffect(() => {
      const subjectList: any = []
      if (list?.length > 0) {
        list.map((item: any) => {
          subjectList.push({
            label: item?.subject,
            value: item?.subject,
          })
        });
        setSubjectListDetail(subjectList);
      }
    }, [list]);

    useEffect(() => {
      const branches = Object.keys(apiResponse[userFirestoreData?.usersData?.university][userFirestoreData?.usersData.course])
          .map((branch) => ({
            label: branch,
            value: branch
          }));
        setBranchData(branches);
        const semesters = apiResponse[userFirestoreData?.usersData?.university][userFirestoreData.usersData.course][userFirestoreData.usersData.branch]?.sem.map((value: any, index: any) => {
          return {
            label: (index + 1).toString(),
            value: (index + 1).toString(),
            status: value
          };
        }).filter((value: any) => value.status === true);
        setSemList(semesters);
    },[])

    const handleSemChange = () => {
      if(formRef.current.values.branch !== ""){
      const semesters = apiResponse[userFirestoreData.usersData.university][userFirestoreData.usersData.course][formRef.current.values.branch]?.sem.map((value: any, index: any) => {
        return {
          label: (index + 1).toString(),
          value: (index + 1).toString(),
          status: value
        };
      }).filter((value: any) => value.status === true);
      setSemList(semesters);
    }
    }

    useEffect(()=>{
    if(selectedBranch !== null){
      const semesters = apiResponse[userFirestoreData.usersData.university][userFirestoreData.usersData.course][selectedBranch]?.sem.map((value: any, index: any) => {
        return {
          label: (index + 1).toString(),
          value: (index + 1).toString(),
          status: value
        };
      }).filter((value: any) => value.status === true);
      setSemList(semesters);
    }
    }, [selectedBranch])

    const Step1 = () =>{
      return(
        <Box mb={2}>
          <Text fontSize={'lg'} fontWeight={600} color={theme.colors.black} paddingBottom={1} >
            Branch and Semester
          </Text>
          <Text fontSize={'xs'} fontWeight={500} color={theme.colors.terinaryText} >
            Specify the branch and semester you require resources for.
          </Text>
          <Box justifyContent={'space-around'} alignItems={'center'} paddingTop={2} flexDirection={'row'} >
          <DropdownComponent
            name="branch"
            data={branchData}
            placeholder={'Branch'}
            leftIcon="ellipsis1"
            width={theme.sizes.width * 0.38}
            handleOptions={(item: any)=>{
            }}
          />
          <DropdownComponent
            name="sem"
            data={semList}
            placeholder={getOrdinalSuffix(userFirestoreData.usersData.sem) + ' Sem'}
            leftIcon="bars"
            width={theme.sizes.width * 0.38}
            handleOptions={()=>{}}
          />
          </Box>
        </Box>
      )
    }

    const Step2 = () =>{
      return(
        <Box mb={2}>
          <Text fontSize={'lg'} fontWeight={600} color={theme.colors.black} paddingBottom={1} >
            Subject
          </Text>
          <Text fontSize={'xs'} fontWeight={500} color={theme.colors.terinaryText} >
            Specify the subject you require resources for.
          </Text>
          <Box justifyContent={'center'} alignItems={'center'} paddingTop={2} >
          <DropdownComponent
            name="subject"
            data={subjectListDetail}
            placeholder={'Subject'}
            leftIcon="bars"
            width={theme.sizes.width * 0.8}
            handleOptions={()=>{}}
            searchbar={true}
          />
          </Box>
        </Box>
      )
    }
    const Step3 = () => {
      return(
        <Box mb={10}>
          <Text fontSize={'lg'} fontWeight={600} color={theme.colors.black} paddingBottom={1} >
            Resource Type
          </Text>
          <Text fontSize={'xs'} fontWeight={500} color={theme.colors.terinaryText} >
            Select type of resource you are seeking.
          </Text>
          <Box justifyContent={'center'} alignItems={'center'} paddingTop={2} >
          <DropdownComponent
            name="requestResource"
            data={data}
            placeholder={'Resource Type'}
            leftIcon="bars"
            width={theme.sizes.width * 0.8}
            handleOptions={()=>{}}
            mode={'modal'}
          />
          </Box>
        </Box>
      )
    }

  return (
    <MainScreenLayout rightIconFalse={true} title={''} handleScroll={() => { }} name="">
      <CustomLoader/>
        <Box flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} >
            <Text margin={5} fontWeight={600} fontSize={'3xl'} color={theme.colors.text}  >
              SeekHub
            </Text>
            <TouchableOpacity style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.mainTheme,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 30,
              elevation: 2
            }} onPress={onOpen}>
              <Icon as={Ionicons} name="ios-add-sharp" size="2xl" color={theme.colors.white} />
            </TouchableOpacity>
        </Box>
        <SeekHubTabList/>
        <Actionsheet isOpen={isOpen} onClose={onClose} >
        <Actionsheet.Content backgroundColor={theme.colors.white} paddingX={10} width={theme.sizes.width} >     
              <Box w="100%" px={4} justifyContent="center">
                <Box paddingBottom={5} >
                    <Text fontSize={'2xl'} fontWeight={600} color={theme.colors.black} paddingBottom={2} >
                        Request Resource
                    </Text>
                    <Text fontSize={'xs'} fontWeight={500} color={theme.colors.terinaryText} >
                    Request resources from fellow learners and enhance your studies.
                    </Text>
                </Box>
                  <Form
                    innerRef={formRef}
                    validationSchema={requestResource}
                    initialValues={{
                      subject: '',
                      requestResource: '',
                      branch: userFirestoreData.usersData.branch,
                      sem:  userFirestoreData.usersData.sem
                    }}
                    onSubmit={values => {
                      onClose();
                      dispatch(setCustomLoader(true));
                      dispatch(SeekHubActions.submitNewRequest(uid, userFirestoreData.usersData, values, photoURL))
                    }}
                    >
                      <Box mb={2}>
                    <Text fontSize={'lg'} fontWeight={600} color={theme.colors.black} paddingBottom={1} >
                      Branch and Semester
                    </Text>
                    <Text fontSize={'xs'} fontWeight={500} color={theme.colors.terinaryText} >
                      Specify the branch and semester you require resources for.
                    </Text>
                    <Box justifyContent={'space-around'} alignItems={'center'} paddingTop={2} flexDirection={'row'} >
                    <DropdownComponent
                      name="branch"
                      data={branchData}
                      placeholder={userFirestoreData?.usersData?.branch}
                      leftIcon="ellipsis1"
                      width={theme.sizes.width * 0.38}
                      handleOptions={(item: any)=>{
                        setSelectedBranch(item.value);
                      }}
                    />
                    <DropdownComponent
                      name="sem"
                      data={semList}
                      placeholder={getOrdinalSuffix(userFirestoreData.usersData.sem) + ' Sem'}
                      leftIcon="bars"
                      width={theme.sizes.width * 0.38}
                      handleOptions={()=>{}}
                    />
                      </Box>
                    </Box>
                      <Step2/>
                      <Step3/>
                      <CustomBtn title="Submit" color={theme.colors.mainTheme}/>
                  </Form>
                </Box>
        </Actionsheet.Content>
        </Actionsheet>
    </MainScreenLayout>
  )
}

export default SeekHubScreen

const styles = StyleSheet.create({})