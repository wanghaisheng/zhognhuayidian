import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-paper">
      <div className="container mx-auto px-4 py-16">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="ancient-title text-4xl md:text-5xl mb-4 text-tcm-ink">
            联系我们
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            传承中医智慧，服务全球用户
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* 联系信息 */}
          <div className="space-y-8">
            <div className="ancient-card p-8">
              <h2 className="ancient-title text-2xl mb-6 text-tcm-bronze">联系方式</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-tcm-bronze/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-tcm-bronze" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-tcm-ink mb-1">邮箱</h3>
                    <p className="text-muted-foreground">contact@zhonghuayidian.org</p>
                    <p className="text-sm text-muted-foreground">support@zhonghuayidian.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-tcm-celadon/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-tcm-celadon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-tcm-ink mb-1">电话</h3>
                    <p className="text-muted-foreground">+86 400-123-4567</p>
                    <p className="text-sm text-muted-foreground">工作日 9:00-18:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-tcm-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-tcm-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-tcm-ink mb-1">地址</h3>
                    <p className="text-muted-foreground">
                      北京市朝阳区<br />
                      中医药大厦 8层<br />
                      邮编: 100020
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-tcm-ink/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-tcm-ink" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-tcm-ink mb-1">工作时间</h3>
                    <p className="text-muted-foreground">
                      周一至周五: 9:00 - 18:00<br />
                      周六: 9:00 - 12:00<br />
                      周日及法定节假日: 休息
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 联系表单 */}
          <div className="ancient-card p-8">
            <h2 className="ancient-title text-2xl mb-6 text-tcm-bronze">发送消息</h2>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-tcm-ink mb-2">
                  姓名 *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-tcm-bronze/30 rounded-lg bg-card/50 focus:outline-none focus:ring-2 focus:ring-tcm-bronze/50 focus:border-tcm-bronze transition-all"
                  placeholder="请输入您的姓名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tcm-ink mb-2">
                  邮箱 *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-tcm-bronze/30 rounded-lg bg-card/50 focus:outline-none focus:ring-2 focus:ring-tcm-bronze/50 focus:border-tcm-bronze transition-all"
                  placeholder="请输入您的邮箱"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tcm-ink mb-2">
                  主题
                </label>
                <select className="w-full px-4 py-3 border border-tcm-bronze/30 rounded-lg bg-card/50 focus:outline-none focus:ring-2 focus:ring-tcm-bronze/50 focus:border-tcm-bronze transition-all">
                  <option value="">请选择主题</option>
                  <option value="general">一般咨询</option>
                  <option value="technical">技术支持</option>
                  <option value="academic">学术合作</option>
                  <option value="feedback">意见反馈</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-tcm-ink mb-2">
                  消息 *
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-tcm-bronze/30 rounded-lg bg-card/50 focus:outline-none focus:ring-2 focus:ring-tcm-bronze/50 focus:border-tcm-bronze transition-all resize-none"
                  placeholder="请输入您的消息内容"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-tcm-bronze to-tcm-bronze/80 text-tcm-paper rounded-lg font-medium hover:from-tcm-bronze/90 hover:to-tcm-bronze/70 transition-all duration-300 transform hover:scale-[1.02]"
              >
                发送消息
              </button>
            </form>
          </div>
        </div>

        {/* 其他信息 */}
        <div className="mt-16 text-center">
          <div className="ancient-card bg-gradient-to-r from-tcm-bronze/5 to-tcm-celadon/5 border-tcm-bronze/20 rounded-3xl p-8 max-w-4xl mx-auto">
            <h2 className="ancient-title text-2xl mb-4 text-tcm-ink">关于中华医典</h2>
            <p className="text-muted-foreground leading-relaxed">
              中华医典致力于传承和弘扬中华传统医学文化，通过数字化技术让古老的中医智慧
              焕存于世，惠及全球。我们收录了中国历代医学古籍1000余部，卷帙上万，文字总量达4亿，
              为中医学术研究、临床实践和文化传承提供了宝贵的资源。
            </p>
            <p className="text-muted-foreground mt-4">
              如果您有任何问题、建议或合作意向，欢迎随时与我们联系。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
