import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea, FormInstance } from '@ant-design/pro-form';
import { useHistory, useParams, useRequest } from 'ice';
import { getTags } from '@/pages/Post123/services/tags';
import { getCategories } from '@/pages/Post123/services/category';
import { DefaultOptionType } from 'antd/lib/select';
import { createPost, getPost, updatePost } from '@/pages/Post123/services/post';
import { message } from 'antd';
import { POST_MANAGE_URL } from '@/constants/path';

const PostCreate: React.FC = () => {
  const history = useHistory();
  const [content, setContent] = useState('');

  const formRef = useRef<FormInstance>();

  const { data: tagData, request: fetchTag } = useRequest(getTags);
  const { data: categoryData, request: fetchCategory } = useRequest(getCategories);
  // 如果是编辑文章的话，可以获取到params中的Id

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    id &&
      getPost(id).then(({ data }) => {
        console.log(data);
        setContent(data.content);
        message.loading({ content: '正在获取文章数据', duration: 1 }).then(() => {
          formRef.current?.setFieldsValue({
            title: data.title,
            tags: data.tags?.map((tag) => tag.id),
            categories: data.categories?.map((category) => category.id),
            introduction: data.introduction,
          });
        });
      });
  }, [id]);

  useEffect(() => {
    fetchTag();
    fetchCategory();
  }, []);

  const tagOptions = useMemo<DefaultOptionType[]>(() => {
    if (tagData) {
      const { data } = tagData;
      return data.map((tag) => {
        return {
          value: tag.id,
          label: tag.name,
        };
      });
    } else {
      return [];
    }
  }, [tagData]);

  const categoryOptions = useMemo<DefaultOptionType[]>(() => {
    if (categoryData) {
      const { data } = categoryData;
      return data.map((tag) => {
        return {
          value: tag.id,
          label: tag.name,
        };
      });
    } else {
      return [];
    }
  }, [categoryData]);

  return (
    <PageContainer
      content={
        <ProForm
          formRef={formRef}
          layout="inline"
          onFinish={async (value) => {
            const req: CreatePostReq = { content, ...value };
            const { title, introduction, tags, categories } = req;
            if (id) {
              // 更新文章
              await updatePost(id, { title, introduction, tags, content, categories });
              message.success(`【${value.title}】文章修改成功`);
            } else {
              // 创建文章
              await createPost(req);
              message.success(`【${value.title}】文章创建成功`);
            }
            setContent('');
            formRef.current?.resetFields();

            history.push(POST_MANAGE_URL);
          }}
        >
          <ProFormText
            name="title"
            label="文章标题"
            width="md"
            placeholder={'请输入文章标题'}
            rules={[
              {
                required: true,
                message: '请输入文章标题',
              },
            ]}
          />
          <ProFormSelect
            placeholder={'请选择文章分类'}
            mode={'multiple'}
            options={categoryOptions}
            width={'sm'}
            name="categories"
            label="文章分类"
          />
          <ProFormSelect
            placeholder={'请选择文章标签'}
            mode={'multiple'}
            width={'sm'}
            options={tagOptions}
            name="tags"
            label="文章标签"
          />
          <br />
          <ProFormTextArea
            width="md"
            label="文章简介"
            placeholder={'请输入文章简介'}
            rules={[
              {
                required: true,
                message: '请输入文章简介',
              },
            ]}
            name="introduction"
          />
        </ProForm>
      }
    >
      <textarea />
    </PageContainer>
  );
};

export default PostCreate;
