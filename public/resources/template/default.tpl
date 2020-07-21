原始数据
列数据
{{@ columns | obj2json }}
表数据
{{@ table | obj2json }}

过滤器如下:
下划线转驼峰首字母大写
'{{table.convertName}}' => '{{table.convertName | underline2hump | first2upper}}'
首字母大写
'helloworld' => '{{'helloworld' | first2upper}}'
转小写
'HelloWorld' => '{{'HelloWorld' | lower}}'
转大写
'helloworld' => '{{'helloworld' | upper}}'
驼峰转下划线
'HelloWorld' => '{{'HelloWorld' | hump2underline}}'

定义变量
{{set $columnsLen = columns?.length | 0}}
总字段{{$columnsLen}}个
{{each columns}}
当前下标{{$index}}
'{{$value.name | underline2hump | first2upper}}'{{if $index+1<$columnsLen}},{{else}}{{/if}}
{{/each}}  