use std::io::{Write, self};

use kcp::Kcp;
use napi::{bindgen_prelude::*, JsFunction, threadsafe_function::ThreadsafeFunction, Error, JsString, JsNumber};
use napi_derive::napi;
use napi::Result;

fn kcp_err(er: kcp::Error) -> Error {
    Error::from_reason(format!("kcp error {}", er))
}

#[derive(Clone)]
struct KcpContext {
    address: JsString,
    port: JsNumber
}

type JsSenderArgs = (Vec<u8>, u32, KcpContext);

#[derive(Clone)]
#[napi]
struct KcpSender(ThreadsafeFunction<JsSenderArgs>);

#[napi]
impl KcpSender {
    #[napi(factory, ts_args_type = "send: (data: Buffer, size: number, context: { address: string, port: number }) => void")]
    pub fn new(send: JsFunction) -> Result<Self> {
        let ts_send = send
        .create_threadsafe_function::<JsSenderArgs, _, _, _>(0, |ctx| {
            let js_data = ctx.env.create_buffer_with_data(ctx.value.0)?;
            let js_sz = ctx.env.create_uint32(ctx.value.1)?;
            let mut js_kcp_ctx = ctx.env.create_object()?;
            js_kcp_ctx.set("address", ctx.value.2.address)?;
            js_kcp_ctx.set("port", ctx.value.2.port)?;

            Ok(vec![
                js_data.into_unknown(),
                js_sz.into_unknown(),
                js_kcp_ctx.into_unknown()
            ])
        })?;
        Ok(Self(ts_send))
    }

    pub fn inner(&self, data: Vec<u8>, size: u32, kcp_ctx: KcpContext) {
        self.0.call(Ok((data, size, kcp_ctx)), napi::threadsafe_function::ThreadsafeFunctionCallMode::NonBlocking);
    }
}

struct KcpWriter {
    send: KcpSender,
    ctx: KcpContext
}

impl Write for KcpWriter {
    fn write(&mut self, data: &[u8]) -> io::Result<usize> {
        self.send.inner(data.to_owned(), data.len() as u32, self.ctx.clone());
        Ok(data.len())
    }

    fn flush(&mut self) -> io::Result<()> {
        Ok(())
    }
}

#[napi(js_name = "Kcp")]
struct JsKcp(Kcp<KcpWriter>);

#[napi]
impl JsKcp {
    #[napi(constructor, ts_args_type = "conv: number, token: number, send: KcpSender, context: { address: string, port: number }")]
    pub fn new(conv: u32, token: u32, send: &KcpSender, context: Object) -> Self {
        let ctx = KcpContext {
            address: context.get("address").unwrap().unwrap(),
            port: context.get("port").unwrap().unwrap()
        };

        let writer = KcpWriter {
            send: send.clone(),
            ctx
        };
        Self(Kcp::new(conv, token, writer))
    }

    #[napi(factory, ts_args_type = "conv: number, token: number, send: KcpSender, context: { address: string, port: number }")]
    pub fn new_stream(conv: u32, token: u32, send: &KcpSender, context: Object) -> Self {
        let ctx = KcpContext {
            address: context.get("address").unwrap().unwrap(),
            port: context.get("port").unwrap().unwrap()
        };

        let writer = KcpWriter {
            send: send.clone(),
            ctx
        };
        Self(Kcp::new(conv, token, writer))
    }

    #[napi(ts_args_type = "context: { address: string, port: number}")]
    pub fn switch_context(&mut self, context: Object) {
        self.0.output.0.ctx = KcpContext {
            address: context.get("address").unwrap().unwrap(),
            port: context.get("port").unwrap().unwrap()
        };
    }

    #[napi]
    pub fn peeksize(&self) -> Result<u32> {
        self.0.peeksize().map(|s| s as u32).map_err(kcp_err)
    }

    #[napi]
    pub fn move_buf(&mut self) {
        self.0.move_buf();
    }

    #[napi]
    pub fn recv(&mut self, mut buf: Buffer) -> Result<u32> {
        self.0.recv(&mut buf).map(|s| s as u32).map_err(kcp_err)
    }

    #[napi]
    pub fn send(&mut self, buf: Buffer) -> Result<u32> {
        self.0.send(&buf).map(|s| s as u32).map_err(kcp_err)
    }

    #[napi]
    pub fn input_conv(&mut self) {
        self.0.input_conv();
    }

    #[napi]
    pub fn waiting_conv(&self) -> bool {
        self.0.waiting_conv()
    }

    #[napi]
    pub fn set_conv(&mut self, conv: u32) {
        self.0.set_conv(conv);
    }

    #[napi]
    pub fn input(&mut self, buf: Buffer) -> Result<u32> {
        self.0.input(&buf).map(|s| s as u32).map_err(kcp_err)
    }

    #[napi]
    pub fn flush_ack(&mut self) -> Result<()> {
        self.0.flush_ack().map_err(kcp_err)
    }

    #[napi]
    pub fn flush(&mut self) -> Result<()> {
        self.0.flush().map_err(kcp_err)
    }

    #[napi]
    pub fn update(&mut self, current: u32) -> Result<()> {
        self.0.update(current).map_err(kcp_err)
    }

    #[napi]
    pub fn check(&self, current: u32) -> u32 {
        self.0.check(current)
    }

    #[napi]
    pub fn set_mtu(&mut self, mtu: u32) -> Result<()> {
        self.0.set_mtu(mtu as usize).map_err(kcp_err)
    }

    #[napi]
    pub fn mtu(&self) -> u32 {
        self.0.mtu() as u32
    }

    #[napi]
    pub fn set_interval(&mut self, interval: u32) {
        self.0.set_interval(interval)
    }

    #[napi]
    pub fn set_nodelay(&mut self, nodelay: bool, interval: i32, resend: i32, nc: bool) {
        self.0.set_nodelay(nodelay, interval, resend, nc)
    }

    /// WARN: sndwnd & rcvwnd must be 16 bit
    #[napi]
    pub fn set_wndsize(&mut self, sndwnd: u32, rcvwnd: u32) {
        self.0.set_wndsize(sndwnd as u16, rcvwnd as u16)
    }

    #[napi]
    pub fn snd_wnd(&self) -> u32 {
       self.0.snd_wnd() as u32
    }

    #[napi]
    pub fn rcv_wnd(&self) -> u32 {
        self.0.rcv_wnd() as u32
    }

    #[napi]
    pub fn wait_snd(&self) -> u32 {
        self.0.wait_snd() as u32
    }

    #[napi]
    pub fn set_rx_minrto(&mut self, rto: u32) {
        self.0.set_rx_minrto(rto)
    }

    #[napi]
    pub fn header_len(&self) -> u32 {
        Kcp::<KcpWriter>::header_len() as u32
    }

    #[napi]
    pub fn is_stream(&self) -> bool {
        self.0.is_stream()
    }

    #[napi]
    pub fn mss(&self) -> u32 {
        self.0.mss()
    }

    #[napi]
    pub fn set_maximum_resend_times(&mut self, dead_link: u32) {
        self.0.set_maximum_resend_times(dead_link)
    }

    #[napi]
    pub fn is_dead_link(&self) -> bool {
        self.0.is_dead_link()
    }
}