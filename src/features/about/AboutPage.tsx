import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import MarkdownEditor from '@/components/MarkdownEditor';
import { Button, message, Space } from 'antd';
import { useRequest } from 'ice';
import { createAbout, getAbout, updateAbout } from '@/features/common/services';

export const AboutPage: React.FC = () => {
  const { data } = useRequest(getAbout, { manual: false });
  const aboutData = data?.data;
  const [content, setContent] = useState('');

  const handleSaveAbout = async () => {
    console.log(content);
    if (aboutData?.id) {
      await updateAbout(aboutData?.id, { content });
    } else {
      await createAbout({ content });
    }
    message.success('修改成功');
  };

  const handleGetAbout = () => {
    setContent(aboutData?.content || '');
  };
  return (
    <PageContainer
      content={
        <>
          <Space>
            <Button type={'primary'} onClick={handleSaveAbout}>
              保存
            </Button>
            <Button type={'primary'} onClick={handleGetAbout}>
              获取
            </Button>
          </Space>
          <MarkdownEditor
            style={{ height: 'calc(100vh - 100px)', marginTop: 24 }}
            modelValue={content}
            codeTheme={'atom'}
            showCodeRowNumber
            onChange={setContent}
          />
        </>
      }
    />
  );
};
