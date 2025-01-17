package cn.rongcloud.scriptgame.util;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;
import android.view.View;

import androidx.annotation.RequiresApi;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

/**
 * 系统工具类
 * eg: 高斯模糊、判断是否有网
 */
public class SystemUtil {

    private SystemUtil() {
        throw new IllegalAccessError("SystemUtil can not be initialized.");
    }

    /**
     * 获取 Activity 的截图
     *
     * @param activity
     * @return
     */
    public static Bitmap getActivityScreenshot(Activity activity) {
        if (activity == null) {
            return null;
        }
        View v = activity.findViewById(android.R.id.content);
        v.buildDrawingCache();
        Bitmap bitmap = Bitmap.createBitmap(v.getDrawingCache());
        v.destroyDrawingCache();
        return bitmap;
    }

    /**
     * 对 Bitmap 做高斯模糊处理
     *
     * @param context
     * @param bitmap  原图
     * @param radius  模糊半径
     * @param scale   模糊处理前的缩放比例
     * @return 高斯模糊后的 bitmap
     */
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public static Bitmap getBlurryBitmap(Context context, Bitmap bitmap, float radius, float scale) {
        RenderScript renderScript = RenderScript.create(context);

        bitmap = Bitmap.createScaledBitmap(bitmap, (int) (scale * bitmap.getWidth()), (int) (scale * bitmap.getHeight()), false);
        final Allocation input = Allocation.createFromBitmap(renderScript, bitmap);
        final Allocation output = Allocation.createTyped(renderScript, input.getType());

        ScriptIntrinsicBlur scriptIntrinsicBlur = ScriptIntrinsicBlur.create(renderScript, Element.U8_4(renderScript));
        scriptIntrinsicBlur.setInput(input);
        scriptIntrinsicBlur.setRadius(radius);
        scriptIntrinsicBlur.forEach(output);
        output.copyTo(bitmap);
        renderScript.destroy();
        return bitmap;
    }

    public static int dp2px(Context context, int dp) {
        float density = context.getApplicationContext().getResources().getDisplayMetrics().density;
        return (int) (density * dp + 0.5);
    }

    /**
     * 判断是否有网络连接
     *
     * @param context
     * @return
     */
    public static boolean isNetworkConnected(Context context) {
        if (context != null) {
            // 获取手机所有连接管理对象(包括对wi-fi,net等连接的管理)
            ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            // 获取NetworkInfo对象
            NetworkInfo networkInfo = manager.getActiveNetworkInfo();
            //判断NetworkInfo对象是否为空
            if (networkInfo != null) {
                return networkInfo.isAvailable() && networkInfo.isConnected();
            }
        }
        return false;
    }

    /**
     * 根据imagepath获取bitmap
     */
    /**
     * 得到本地或者网络上的bitmap url - 网络或者本地图片的绝对路径,比如:
     * <p>
     * A.网络路径: url="http://blog.foreverlove.us/girl2.png" ;
     * <p>
     * B.本地路径:url="file://mnt/sdcard/photo/image.png";
     * <p>
     * C.支持的图片格式 ,png, jpg,bmp,gif等等
     *
     * @param url
     * @return
     */
    public static int IO_BUFFER_SIZE = 2 * 1024;

    public static Bitmap getUrlBitmap(String url, int scaleRatio) {
        int blurRadius = 8;//通常设置为8就行。
        if (scaleRatio <= 0) {
            scaleRatio = 10;
        }

        Bitmap originBitmap = null;
        InputStream in = null;
        BufferedOutputStream out = null;
        try {
            in = new BufferedInputStream(new URL(url).openStream(), IO_BUFFER_SIZE);
            final ByteArrayOutputStream dataStream = new ByteArrayOutputStream();
            out = new BufferedOutputStream(dataStream, IO_BUFFER_SIZE);
            copy(in, out);
            out.flush();
            byte[] data = dataStream.toByteArray();
            originBitmap = BitmapFactory.decodeByteArray(data, 0, data.length);


            Bitmap scaledBitmap = Bitmap.createScaledBitmap(originBitmap,
                    originBitmap.getWidth() / scaleRatio,
                    originBitmap.getHeight() / scaleRatio,
                    false);
            Bitmap blurBitmap = doBlur(scaledBitmap, blurRadius, true);
            return blurBitmap;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private static void copy(InputStream in, OutputStream out)
            throws IOException {
        byte[] b = new byte[IO_BUFFER_SIZE];
        int read;
        while ((read = in.read(b)) != -1) {
            out.write(b, 0, read);
        }
    }

    // 把本地图片毛玻璃化
    public static Bitmap toBlur(Bitmap originBitmap, int scaleRatio) {
        //  int scaleRatio = 10;
        // 增大scaleRatio缩放比，使用一样更小的bitmap去虚化可以到更好的得模糊效果，而且有利于占用内存的减小；
        int blurRadius = 8;//通常设置为8就行。
        //增大blurRadius，可以得到更高程度的虚化，不过会导致CPU更加intensive


  /* 其中前三个参数很明显，其中宽高我们可以选择为原图尺寸的1/10；
  第四个filter是指缩放的效果，filter为true则会得到一个边缘平滑的bitmap，
  反之，则会得到边缘锯齿、pixelrelated的bitmap。
  这里我们要对缩放的图片进行虚化，所以无所谓边缘效果，filter=false。*/
        if (scaleRatio <= 0) {
            scaleRatio = 10;
        }
        Bitmap scaledBitmap = Bitmap.createScaledBitmap(originBitmap,
                originBitmap.getWidth() / scaleRatio,
                originBitmap.getHeight() / scaleRatio,
                false);
        Bitmap blurBitmap = doBlur(scaledBitmap, blurRadius, true);
        return blurBitmap;
    }


    public static Bitmap doBlur(Bitmap sentBitmap, int radius, boolean canReuseInBitmap) {
        Bitmap bitmap;
        if (canReuseInBitmap) {
            bitmap = sentBitmap;
        } else {
            bitmap = sentBitmap.copy(sentBitmap.getConfig(), true);
        }


        if (radius < 1) {
            return (null);
        }


        int w = bitmap.getWidth();
        int h = bitmap.getHeight();


        int[] pix = new int[w * h];
        bitmap.getPixels(pix, 0, w, 0, 0, w, h);


        int wm = w - 1;
        int hm = h - 1;
        int wh = w * h;
        int div = radius + radius + 1;


        int r[] = new int[wh];
        int g[] = new int[wh];
        int b[] = new int[wh];
        int rsum, gsum, bsum, x, y, i, p, yp, yi, yw;
        int vmin[] = new int[Math.max(w, h)];


        int divsum = (div + 1) >> 1;
        divsum *= divsum;
        int dv[] = new int[256 * divsum];
        for (i = 0; i < 256 * divsum; i++) {
            dv[i] = (i / divsum);
        }


        yw = yi = 0;


        int[][] stack = new int[div][3];
        int stackpointer;
        int stackstart;
        int[] sir;
        int rbs;
        int r1 = radius + 1;
        int routsum, goutsum, boutsum;
        int rinsum, ginsum, binsum;


        for (y = 0; y < h; y++) {
            rinsum = ginsum = binsum = routsum = goutsum = boutsum = rsum = gsum = bsum = 0;
            for (i = -radius; i <= radius; i++) {
                p = pix[yi + Math.min(wm, Math.max(i, 0))];
                sir = stack[i + radius];
                sir[0] = (p & 0xff0000) >> 16;
                sir[1] = (p & 0x00ff00) >> 8;
                sir[2] = (p & 0x0000ff);
                rbs = r1 - Math.abs(i);
                rsum += sir[0] * rbs;
                gsum += sir[1] * rbs;
                bsum += sir[2] * rbs;
                if (i > 0) {
                    rinsum += sir[0];
                    ginsum += sir[1];
                    binsum += sir[2];
                } else {
                    routsum += sir[0];
                    goutsum += sir[1];
                    boutsum += sir[2];
                }
            }
            stackpointer = radius;


            for (x = 0; x < w; x++) {


                r[yi] = dv[rsum];
                g[yi] = dv[gsum];
                b[yi] = dv[bsum];


                rsum -= routsum;
                gsum -= goutsum;
                bsum -= boutsum;


                stackstart = stackpointer - radius + div;
                sir = stack[stackstart % div];


                routsum -= sir[0];
                goutsum -= sir[1];
                boutsum -= sir[2];


                if (y == 0) {
                    vmin[x] = Math.min(x + radius + 1, wm);
                }
                p = pix[yw + vmin[x]];


                sir[0] = (p & 0xff0000) >> 16;
                sir[1] = (p & 0x00ff00) >> 8;
                sir[2] = (p & 0x0000ff);


                rinsum += sir[0];
                ginsum += sir[1];
                binsum += sir[2];


                rsum += rinsum;
                gsum += ginsum;
                bsum += binsum;


                stackpointer = (stackpointer + 1) % div;
                sir = stack[(stackpointer) % div];


                routsum += sir[0];
                goutsum += sir[1];
                boutsum += sir[2];


                rinsum -= sir[0];
                ginsum -= sir[1];
                binsum -= sir[2];


                yi++;
            }
            yw += w;
        }
        for (x = 0; x < w; x++) {
            rinsum = ginsum = binsum = routsum = goutsum = boutsum = rsum = gsum = bsum = 0;
            yp = -radius * w;
            for (i = -radius; i <= radius; i++) {
                yi = Math.max(0, yp) + x;


                sir = stack[i + radius];


                sir[0] = r[yi];
                sir[1] = g[yi];
                sir[2] = b[yi];


                rbs = r1 - Math.abs(i);


                rsum += r[yi] * rbs;
                gsum += g[yi] * rbs;
                bsum += b[yi] * rbs;


                if (i > 0) {
                    rinsum += sir[0];
                    ginsum += sir[1];
                    binsum += sir[2];
                } else {
                    routsum += sir[0];
                    goutsum += sir[1];
                    boutsum += sir[2];
                }


                if (i < hm) {
                    yp += w;
                }
            }
            yi = x;
            stackpointer = radius;
            for (y = 0; y < h; y++) {
                // Preserve alpha channel: ( 0xff000000 & pix[yi] )
                pix[yi] = (0xff000000 & pix[yi]) | (dv[rsum] << 16) | (dv[gsum] << 8) | dv[bsum];


                rsum -= routsum;
                gsum -= goutsum;
                bsum -= boutsum;


                stackstart = stackpointer - radius + div;
                sir = stack[stackstart % div];


                routsum -= sir[0];
                goutsum -= sir[1];
                boutsum -= sir[2];


                if (x == 0) {
                    vmin[y] = Math.min(y + r1, hm) * w;
                }
                p = x + vmin[y];


                sir[0] = r[p];
                sir[1] = g[p];
                sir[2] = b[p];


                rinsum += sir[0];
                ginsum += sir[1];
                binsum += sir[2];


                rsum += rinsum;
                gsum += ginsum;
                bsum += binsum;


                stackpointer = (stackpointer + 1) % div;
                sir = stack[stackpointer];


                routsum += sir[0];
                goutsum += sir[1];
                boutsum += sir[2];


                rinsum -= sir[0];
                ginsum -= sir[1];
                binsum -= sir[2];


                yi += w;
            }
        }


        bitmap.setPixels(pix, 0, w, 0, 0, w, h);


        return (bitmap);
    }

}
