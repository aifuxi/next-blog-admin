import React, { useEffect, useRef, useState } from 'react';
import { Button, Drawer, Space, Switch, Tag, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Post } from '@/types/post';
import { getPost, queryPost, updatePost } from '@/pages/Post123/services/post';
import { generatePath, useHistory, useRequest } from 'ice';
import { getTags } from '@/pages/Post123/services/tags';
import { getCategories } from '@/pages/Post123/services/category';
import { POST_EDIT_URL } from '@/constants/path';

const PostManage: React.FC = () => {
  const history = useHistory();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post>({
    categories: [],
    content: '',
    createdAt: '',
    id: '',
    introduction: '',
    isDelete: false,
    tags: [],
    title: '',
    updatedAt: '',
  });

  const { data: tagData, request: fetchTag } = useRequest(getTags);
  const { data: categoryData, request: fetchCategory } = useRequest(getCategories);

  useEffect(() => {
    fetchTag();
    fetchCategory();
  }, []);

  const tagMap = new Map();
  tagData?.data.forEach((tag) => {
    tagMap.set(tag.id, { text: tag.name, status: tag.id });
  });

  const categoryMap = new Map();
  categoryData?.data.forEach((category) => {
    categoryMap.set(category.id, category.name);
  });

  const columns: Array<ProColumns<Post>> = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      fixed: 'left',
      search: false,
    },
    {
      title: '文章ID',
      width: 120,
      ellipsis: true,
      dataIndex: 'id',
      copyable: true,
      fixed: 'left',
    },
    {
      title: '文章标题',
      width: 300,
      ellipsis: true,
      dataIndex: 'title',
      copyable: true,
      fixed: 'left',
    },
    {
      title: '文章简介',
      width: 700,
      ellipsis: true,
      dataIndex: 'introduction',
      search: false,
    },
    {
      title: '文章分类',
      width: 300,
      ellipsis: true,
      valueType: 'select',
      dataIndex: 'categories',
      valueEnum: categoryMap,
      fieldProps: { mode: 'multiple' },
      render: (_, post) => (
        <Space>
          {post.categories?.length ? (
            post.categories.map((item) => (
              <Tag key={item.id} color="geekblue">
                {item.name}
              </Tag>
            ))
          ) : (
            <Tag>暂无</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '文章标签',
      dataIndex: 'tags',
      width: 300,
      ellipsis: true,
      valueType: 'select',
      valueEnum: tagMap,
      fieldProps: { mode: 'multiple' }, // 设置下拉框为多选
      render: (_, post) => (
        <Space>
          {post.tags?.length ? (
            post.tags.map((item) => (
              <Tag key={item.id} color="purple">
                {item.name}
              </Tag>
            ))
          ) : (
            <Tag>暂无</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '是否删除',
      dataIndex: 'isDelete',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, post) => {
        return (
          <Switch
            checked={post.isDelete}
            onClick={async (isDelete) => {
              await updatePost(post.id, { isDelete });
              actionRef.current?.reload();
            }}
          />
        );
      },
      search: false,
    },
    {
      title: '创建时间',
      width: 180,
      dataIndex: 'createdAt',
      align: 'center',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '更新时间',
      width: 180,
      dataIndex: 'updatedAt',
      align: 'center',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      width: 90,
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      render: (_, post) => [
        <Tooltip placement="top" title="预览文章">
          <Button
            icon={<EyeOutlined />}
            onClick={async () => {
              console.log(post.id);
              const data = await getPost(post.id);
              setVisible(true);
              setPreviewPost(data.data);
            }}
          />
        </Tooltip>,
        <Tooltip placement="top" title="编辑文章">
          <Button
            icon={<EditOutlined />}
            onClick={async () => {
              console.log(post.id);
              history.push(generatePath(POST_EDIT_URL, { id: post.id }));
            }}
          />
        </Tooltip>,
      ],
    },
  ];

  return (
    <>
      <ProTable<Post>
        columns={columns}
        scroll={{ x: 2500 }}
        actionRef={actionRef}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, 'cans');
          const { current: page = 1, pageSize = 10, title, id, categories, tags } = params;
          const { data } = await queryPost({ title, page, pageSize, id, categories, tags });
          return Promise.resolve({
            data,
            success: true,
          });
        }}
        rowKey={(record) => record.id}
        search={{
          collapsed: false,
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="文章列表"
      />
      <Drawer
        title={previewPost.title}
        placement="right"
        size="large"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        {previewPost.content}
      </Drawer>
    </>
  );
};

export default PostManage;
