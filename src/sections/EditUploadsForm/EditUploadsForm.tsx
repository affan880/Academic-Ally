import { Modal, Text } from 'native-base'
import React, { useState } from 'react'
import { Dimensions, View } from 'react-native'
import { useSelector } from 'react-redux';

import { CustomBtn } from '../../components/CustomFormComponents/CustomBtn';
import { CustomTextInput } from '../../components/CustomFormComponents/CustomTextInput';
import DropdownComponent from '../../components/CustomFormComponents/Dropdown';
import Form from '../../components/Forms/form';
import { EditUploadvalidationSchema } from '../../utilis/validation';

type Props = {
    isOpen: boolean
    onClose: () => void
    data: any
    approve: () => void
    setEditedData: (data: any) => void
}

const screenWidth = Dimensions.get('window').width;

const EditUploadsForm = ({ isOpen, onClose, data, approve, setEditedData }: Props) => {
    const theme = useSelector((state: any) => state.theme);
    const defaultData: any = data;
    const editData = data
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" >
            <Modal.Content>
                <Form
                    initialValues={{
                        name: editData.name.substring(0, data.name.length - 4),
                        category: editData.category,
                        units: editData.units,
                    }}
                    validationSchema={EditUploadvalidationSchema}
                    onSubmit={(values) => {
                        defaultData.name = values.name + data.name.substring(data.name.length - 4, data.name.length);
                        defaultData.category = values.category;
                        defaultData.units = values.units;
                        setEditedData(defaultData);
                        approve();
                        onClose();
                    }}
                >
                    <View style={{ padding: 10 }}>
                        <CustomTextInput
                            name="name"
                            placeholder="Name"
                            leftIcon={'user'}
                            width={screenWidth / 1.2}
                        />
                        <DropdownComponent
                            name="category"
                            data={[{ label: 'Notes', value: 'Notes' }, { label: 'Syllabus', value: 'Syllabus' }, { label: 'QuestionPapers', value: 'QuestionPapers' }, { label: 'OtherResources', value: 'OtherResources' }]}
                            placeholder={`${editData.category}`}
                            leftIcon="Safety"
                            width={screenWidth / 1.2}
                            handleOptions={() => { }}
                        />
                        <CustomTextInput
                            name="units"
                            leftIcon={'user'}
                            placeholder="Units"
                            width={screenWidth / 1.2}
                        />
                        <View style={{
                            marginTop: 20,
                        }}
                        >
                            <CustomBtn title="Edit" color={theme.colors.mainTheme} width={screenWidth / 1.2} />
                        </View>
                    </View>
                </Form>
            </Modal.Content>
        </Modal>
    )
}



export default EditUploadsForm