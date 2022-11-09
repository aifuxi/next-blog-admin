import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message } from 'antd';
import { useRequest } from 'ice';
import { createProfile, getProfile, updateProfile } from '@/features/common/services';

import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Profile } from '@/features/common/types';
import { ProFormInstance } from '@ant-design/pro-form';

export const ProfilePage: React.FC = () => {
  const { data } = useRequest(getProfile, { manual: false });
  const formRef = useRef<ProFormInstance<Profile>>();
  const profileData = data?.data;
  console.log(profileData);
  const setFormValue = () => {
    profileData && formRef.current?.setFieldsValue(profileData);
  };
  return (
    <PageContainer
      content={
        <>
          <Button type={'primary'} onClick={setFormValue}>
            获取profile
          </Button>
          <ProForm
            formRef={formRef}
            onFinish={async (formData) => {
              if (profileData?.id) {
                await updateProfile(profileData?.id, formData);
              } else {
                await createProfile(formData);
              }
              message.success('修改成功');
            }}
            autoFocusFirstInput
          >
            <ProFormText name="author" label="author" />
            <ProFormText name="email" label="email" />
            <ProFormText name="slogan" label="slogan" />
            <ProFormText name="github" label="github" />
            <ProFormText name="avatar" label="avatar" />
            <ProFormText name="wechat" label="wechat" />
            <ProFormText name="site" label="site" />
          </ProForm>
        </>
      }
    />
  );
};
