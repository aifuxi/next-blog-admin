import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import MarkdownEditor from '@/components/MarkdownEditor';
import { Button, message } from 'antd';
import { useRequest } from 'ice';
import { createAbout, getAbout, updateAbout } from '@/features/common/services';

export const AboutPage: React.FC = () => {
  const { data } = useRequest(getAbout, { manual: false });
  const aboutData = data?.data;
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(aboutData?.content || '');
  }, []);

  const handleSaveAbout = async () => {
    console.log(content);
    if (aboutData?.id) {
      await updateAbout(aboutData?.id, { content });
    } else {
      await createAbout({ content });
    }
    message.success('修改成功');
  };
  return (
    <PageContainer
      content={
        <>
          <Button type={'primary'} onClick={handleSaveAbout}>
            保存
          </Button>
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
