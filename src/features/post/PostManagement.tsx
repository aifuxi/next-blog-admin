import React, { useRef, useState } from 'react';
import { Button, Drawer, message, Modal, Space, Switch, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { generatePath, useHistory, useRequest } from 'ice';
import {
  deletePost,
  findManyPostCategory,
  findManyPosts,
  findManyPostTag,
  getPost,
  updatePost,
} from '../common/services';
import { Post } from '../common/types';
import { POST_EDIT_URL } from '@/constants/path';
import MarkdownEditor from '@/components/MarkdownEditor';

export const PostManagement: React.FC = () => {
  const history = useHistory();
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post>({
    categories: [],
    content: '',
    createdAt: new Date(),
    id: '',
    description: '',
    isDeleted: false,
    tags: [],
    title: '',
    updatedAt: new Date(),
    view: 0,
    isPublished: false,
    publishedAt: new Date(),
  });

  const { data: tagData } = useRequest(findManyPostTag, { defaultParams: [{ limit: 1000, offset: 0 }], manual: false });
  const { data: categoryData } = useRequest(findManyPostCategory, {
    defaultParams: [{ limit: 1000, offset: 0 }],
    manual: false,
  });
  const { data: deletedPostRes, request: deletePostFn } = useRequest(deletePost, {
    manual: true,
  });

  const tagMap = new Map();
  tagData?.data.lists?.forEach((tag) => {
    tagMap.set(tag.id, { text: tag.name, status: tag.id });
  });

  const categoryMap = new Map();
  categoryData?.data.lists?.forEach((category) => {
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
      title: '文章阅读量',
      width: 120,
      dataIndex: 'view',
      search: false,
    },
    {
      title: '文章简介',
      width: 700,
      ellipsis: true,
      dataIndex: 'description',
      search: false,
    },
    {
      title: '是否发布',
      dataIndex: 'isPublished',
      width: 80,
      valueType: 'switch',
      align: 'center',
      fixed: 'right',
      render: (_, post) => {
        return (
          <Switch
            checked={post.isPublished}
            onClick={async (isPublished) => {
              await updatePost(post.id, { isPublished });
              actionRef.current?.reload();
            }}
          />
        );
      },
    },
    {
      title: '是否软删除',
      dataIndex: 'isDeleted',
      tooltip: '软删除后的数据在前端不可见，后台可见',
      width: 80,
      valueType: 'switch',
      align: 'center',
      fixed: 'right',
      render: (_, post) => {
        return (
          <Switch
            checked={post.isDeleted}
            onClick={async (isDeleted) => {
              await updatePost(post.id, { isDeleted });
              actionRef.current?.reload();
            }}
          />
        );
      },
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
      width: 150,
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      render: (_, post) => [
        <Tooltip placement="top" title="预览文章">
          <Button
            icon={<EyeOutlined />}
            onClick={async () => {
              const data = await getPost(post.id);
              setVisible(true);
              setPreviewPost(data.data);
            }}
          />
        </Tooltip>,
        <Tooltip placement="top" title="编辑文章">
          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            onClick={async () => {
              history.push(generatePath(POST_EDIT_URL, { id: post.id }));
            }}
          />
        </Tooltip>,
        <Tooltip placement="top" title="删除文章">
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={async () => {
              Modal.confirm({
                title: 'Confirm',
                icon: <ExclamationCircleOutlined />,
                content: `此操作将会删除id：${post.id}，标题：${post.title}的文章，不可恢复！！！`,
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  await deletePostFn(post.id);
                  actionRef.current?.reload();
                  message.success(`【${deletedPostRes?.data?.title}】文章删除成功`);
                },
              });
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
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const { current: page = 1, pageSize = 10, title, id, categories, tags, isPublished, isDeleted } = params;
          const { data } = await findManyPosts({
            title,
            id,
            isPublished,
            isDeleted,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            categories,
            tags,
          });
          return Promise.resolve({
            data: data.lists,
            total: data.total,
            success: true,
          });
        }}
        rowKey={(record) => record.id}
        search={{
          collapsed: false,
          labelWidth: 100,
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
        <MarkdownEditor modelValue={previewPost.content} previewOnly />
      </Drawer>
    </>
  );
};
