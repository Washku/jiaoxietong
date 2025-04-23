#ifndef LIB_RICH_TIME_H
#define LIB_RICH_TIME_H

/// @brief 设置单片机晶振频率，以MHz为单位。默认11.0592MHz，若你的晶振评率与此相同，则无需调用此函数。
/// @param mhz 晶振频率（MHz）。
void libRich_SetFreqOsc(float mhz);

/// @brief 阻塞延时。使用定时器延时特定毫秒数。此函数运行期间需占用T0定时器。使用此函数前请确认晶振频率是否设置正确，如有必要，请使用libRich_SetFreqOsc()完成晶振频率设置。
/// @param ms 需延时的毫秒数。最小值为1ms。若需要更长延时，请多次调用。例如延时2400ms，则调用两次libRich_DelayMs(1000)和一次libRich_DelayMs(400)。
void libRich_DelayMs(unsigned int ms);

void libRich_Delay5us();
void libRich_Delay10us();
void libRich_Delay50us();
void libRich_Delay500us();

#endif