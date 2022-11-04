import React, { useMemo, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Tag, CreateTagReq } from '@/types/post';
import { Button, message, Switch, Tooltip } from 'antd';
import { createTag, queryTag, updateTag } from '@/pages/Post123/services/tags';
import { ProFormText, ProFormTextArea, ModalForm, ProFormInstance } from '@ant-design/pro-form';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const emptyTag = {
  createdAt: '',
  desc: '',
  id: '',
  isDelete: false,
  name: '',
  updatedAt: '',
};
const PostTag: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<CreateTagReq>>();
  const [visible, setVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag>(emptyTag);

  const title = useMemo(() => {
    return currentTag.id ? '编辑标签' : '新建标签';
  }, [currentTag]);

  const columns: Array<ProColumns<Tag>> = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      search: false,
      fixed: 'left',
    },
    {
      title: '标签ID',
      width: 120,
      ellipsis: true,
      dataIndex: 'id',
      copyable: true,
      fixed: 'left',
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '标签简介',
      width: 700,
      search: false,
      dataIndex: 'desc',
      ellipsis: true,
    },
    {
      title: '是否删除',
      width: 80,
      align: 'center',
      fixed: 'right',
      search: false,
      dataIndex: 'isDelete',
      render: (_, post) => {
        return (
          <Switch
            checked={post.isDelete}
            onClick={async (isDelete) => {
              await updateTag(post.id, { isDelete });
              actionRef.current?.reload();
            }}
          />
        );
      },
    },
    {
      title: '创建时间',
      width: 180,
      search: false,
      dataIndex: 'createdAt',
      align: 'center',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      width: 180,
      dataIndex: 'updatedAt',
      align: 'center',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      width: 60,
      align: 'center',
      fixed: 'right',
      search: false,
      valueType: 'option',
      render: (_, tag) => {
        return (
          <Tooltip placement="top" title="编辑文章标签">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentTag(tag);
                const timer = window.setTimeout(() => {
                  // 这里设置延时是因为第一次，form可能未创建，立即设置值可能不生效，所以设置延时
                  formRef.current?.setFieldsValue(tag);
                  window.clearTimeout(timer);
                }, 500);
                setVisible(true);
              }}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <ModalForm
        visible={visible}
        formRef={formRef}
        title={title}
        onVisibleChange={(v) => {
          setVisible(v);
          if (!v) {
            // 如果关闭了弹窗，把数据清空
            setCurrentTag(emptyTag);
            formRef.current?.resetFields();
          }
        }}
        trigger={
          <Button type="primary" style={{ marginBottom: 12 }} onClick={() => setVisible(true)}>
            <PlusOutlined />
            新建标签
          </Button>
        }
        onFinish={async (values: CreateTagReq) => {
          console.log(values);
          if (currentTag.id) {
            // 存在id,则是编辑状态
            await updateTag(currentTag.id, { name: values.name, desc: values.desc });
            message.success('修改成功');
          } else {
            // 创建
            await createTag(values);
            message.success('创建成功');
          }
          formRef.current?.resetFields();
          setVisible(false);
          actionRef.current?.reload();
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入文章标题',
            },
          ]}
          name="name"
          label="标签名称"
          placeholder="请输入标签名称"
        />
        <ProFormTextArea
          rules={[
            {
              required: true,
              message: '请输入文章标题',
            },
          ]}
          name="desc"
          label="标签描述"
          placeholder="请输入标签描述"
        />
      </ModalForm>

      <ProTable<Tag>
        scroll={{ x: 1500 }}
        columns={columns}
        actionRef={actionRef}
        search={{
          collapsed: false,
        }}
        pagination={{
          pageSize: 10,
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          const { current: page = 1, pageSize = 10, name, id } = params;
          const { data } = await queryTag({ name, page, pageSize, id });
          return Promise.resolve({
            data,
            success: true,
          });
        }}
        rowKey={(record) => record.id}
        dateFormatter="string"
        headerTitle="标签列表"
      />
    </>
  );
};

export default PostTag;
