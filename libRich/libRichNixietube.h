#ifndef __LIBRICHNIXIETUBE_H_
#define __LIBRICHNIXIETUBE_H_

/// @brief 设定数码管显示内容，函数内自带1ms延时。
/// @param location 数码管编号。取值范围[0 - 7]。0为最右侧数码管，7为最左侧数码管。
/// @param index 对应数码管上显示内容。取值范围[0 - 16]，传入0至9显示对应数字。传入10至16显示字符['A', 'b', 'C', 'd', 'E', 'F', 'H']
void libRich_SetCode(unsigned char location, unsigned char index);

#endif