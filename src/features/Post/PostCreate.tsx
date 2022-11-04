import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea, FormInstance } from '@ant-design/pro-form';
import { useHistory, useParams, useRequest } from 'ice';
import { DefaultOptionType } from 'antd/lib/select';
import { CreatePostReq } from './types';
import { createPost, findManyPostCategory, findManyPostTag, getPost, updatePost } from './services';
import { message, Space } from 'antd';
import { POST_MANAGE_URL } from '@/constants/path';

export const PostCreate: React.FC = () => {
  const history = useHistory();
  const [content, setContent] = useState('');

  const formRef = useRef<FormInstance>();

  const { data: tagData } = useRequest(findManyPostTag, { defaultParams: [{ limit: 1000, offset: 0 }], manual: false });
  const { data: categoryData } = useRequest(findManyPostCategory, {
    defaultParams: [{ limit: 1000, offset: 0 }],
    manual: false,
  });
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
            description: data.description,
          });
        });
      });
  }, [id]);

  const tagOptions = useMemo<DefaultOptionType[]>(() => {
    if (tagData) {
      const { data } = tagData;
      return (
        data.lists?.map((tag) => {
          return {
            value: tag.id,
            label: tag.name,
          };
        }) || []
      );
    } else {
      return [];
    }
  }, [tagData]);

  const categoryOptions = useMemo<DefaultOptionType[]>(() => {
    if (categoryData) {
      const { data } = categoryData;
      return (
        data.lists?.map((tag) => {
          return {
            value: tag.id,
            label: tag.name,
          };
        }) || []
      );
    } else {
      return [];
    }
  }, [categoryData]);

  return (
    <PageContainer
      content={
        <ProForm
          formRef={formRef}
          layout={'inline'}
          grid
          rowProps={{
            gutter: [16, 16],
          }}
          submitter={{
            render: (props, doms) => {
              return <Space style={{ marginTop: 16 }}>{doms}</Space>;
            },
          }}
          onFinish={async (value) => {
            const req: CreatePostReq = { content, ...value };
            const { title, description, tags, categories } = req;
            if (id) {
              // 更新文章
              await updatePost(id, { title, description, tags, content, categories });
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
            colProps={{
              span: 8,
            }}
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
            width={'md'}
            colProps={{
              span: 8,
            }}
            name="categories"
            label="文章分类"
          />
          <ProFormSelect
            placeholder={'请选择文章标签'}
            mode={'multiple'}
            width={'md'}
            colProps={{
              span: 8,
            }}
            options={tagOptions}
            name="tags"
            label="文章标签"
          />
          <ProFormTextArea
            width="xl"
            label="文章简介"
            colProps={{
              span: 24,
            }}
            placeholder={'请输入文章简介'}
            rules={[
              {
                required: true,
                message: '请输入文章简介',
              },
            ]}
            name="description"
          />
        </ProForm>
      }
    />
  );
};
